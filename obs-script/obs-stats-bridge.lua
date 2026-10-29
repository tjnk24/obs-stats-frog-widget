obs = obslua

local SECTION = 'ObsStatsDock'
local PARAM = 'PluginOutputs'
local OUTPUT_NAMES = {'multi-output'}
local INTERVAL_MS = 3000
local SERVER_URL_INFO = 0

local function server_origin(url)
    if url == nil then
        return nil
    end

    local scheme, authority = string.match(url, '^(%a[%w+.-]*://)([^/?#]+)')

    if scheme == nil then
        return nil
    end

    return scheme .. string.gsub(authority, '^.*@', '')
end

local function output_server(name)
    local output = obs.obs_get_output_by_name(name)

    if output == nil then
        return nil
    end

    local server = nil
    local service = obs.obs_output_get_service(output)

    if service ~= nil then
        server = obs.obs_service_get_connect_info(service, SERVER_URL_INFO)

        if server == nil or server == '' then
            local settings = obs.obs_service_get_settings(service)
            server = obs.obs_data_get_string(settings, 'server')
            obs.obs_data_release(settings)
        end
    end

    obs.obs_output_release(output)

    return server_origin(server)
end

local function json_string(value)
    local escaped = string.gsub(value, '[%c"\\]', function(char)
        return string.format('\\u%04x', string.byte(char))
    end)

    return '"' .. escaped .. '"'
end

local ENGINE_COUNTER_PATH = '\\GPU Engine(*)\\Utilization Percentage'
local DEDICATED_MEMORY_COUNTER_PATH = '\\GPU Adapter Memory(*)\\Dedicated Usage'
local SHARED_MEMORY_COUNTER_PATH = '\\GPU Adapter Memory(*)\\Shared Usage'
local PDH_FORMAT_DOUBLE_UNCAPPED = 0x8200
local PDH_MORE_DATA = -2147481646
local PDH_VALID_DATA_STATUSES = {[0] = true, [1] = true}
local DEDICATED_MEMORY_MIN_BYTES = 64 * 1024 * 1024

local ffi_loaded, ffi = pcall(require, 'ffi')
local hardware = nil

local function define_native_types()
    pcall(ffi.cdef, [[
        typedef struct {
            uint32_t status;
            union {
                int32_t longValue;
                double doubleValue;
                int64_t largeValue;
                const char *ansiValue;
                const uint16_t *wideValue;
            };
        } StatsBridgeCounterValue;

        typedef struct {
            uint16_t *name;
            StatsBridgeCounterValue value;
        } StatsBridgeCounterItem;

        typedef struct {
            uint32_t length;
            uint32_t memoryLoad;
            uint64_t totalPhysical;
            uint64_t availablePhysical;
            uint64_t totalPageFile;
            uint64_t availablePageFile;
            uint64_t totalVirtual;
            uint64_t availableVirtual;
            uint64_t availableExtendedVirtual;
        } StatsBridgeMemoryStatus;

        int32_t PdhOpenQueryW(const uint16_t *source, uintptr_t userData, void **query);
        int32_t PdhAddEnglishCounterW(void *query, const uint16_t *path, uintptr_t userData, void **counter);
        int32_t PdhCollectQueryData(void *query);
        int32_t PdhGetFormattedCounterArrayW(void *counter, uint32_t format, uint32_t *bufferSize, uint32_t *itemCount, StatsBridgeCounterItem *items);
        int32_t PdhCloseQuery(void *query);
        int GlobalMemoryStatusEx(StatsBridgeMemoryStatus *status);
    ]])
end

local function to_wide_string(text)
    local buffer = ffi.new('uint16_t[?]', #text + 1)

    for position = 1, #text do
        buffer[position - 1] = string.byte(text, position)
    end

    return buffer
end

local function from_wide_string(pointer)
    local characters = {}
    local position = 0

    while pointer[position] ~= 0 do
        local code = pointer[position]

        characters[#characters + 1] = string.char(code < 128 and code or 63)
        position = position + 1
    end

    return table.concat(characters)
end

local function define_adapter_types()
    pcall(ffi.cdef, [[
        typedef struct {
            uint32_t data1;
            uint16_t data2;
            uint16_t data3;
            uint8_t data4[8];
        } StatsBridgeGuid;

        typedef struct {
            uint16_t description[128];
            uint32_t vendorId;
            uint32_t deviceId;
            uint32_t subSystemId;
            uint32_t revision;
            size_t dedicatedVideoMemory;
            size_t dedicatedSystemMemory;
            size_t sharedSystemMemory;
            uint32_t luidLowPart;
            int32_t luidHighPart;
            uint32_t flags;
        } StatsBridgeAdapterDescription;

        int32_t CreateDXGIFactory1(const StatsBridgeGuid *interfaceId, void **factory);
    ]])
end

local FACTORY_INTERFACE_ID = {0x770aae78, 0xf26f, 0x4dba, {0xa8, 0x29, 0x25, 0x3c, 0x83, 0xd1, 0xb3, 0x87}}
local RELEASE_METHOD = 2
local ENUM_ADAPTERS1_METHOD = 12
local GET_DESCRIPTION1_METHOD = 10

local function com_method(object, position, signature)
    return ffi.cast(signature, ffi.cast('void ***', object)[0][position])
end

local function release(object)
    com_method(object, RELEASE_METHOD, 'uint32_t (*)(void *)')(object)
end

local function adapter_key(high_part, low_part)
    return string.format('0x%08x_0x%08x', bit.band(high_part, 0xffffffff), low_part)
end

local function read_adapter_names()
    define_adapter_types()

    local dxgi_loaded, dxgi = pcall(ffi.load, 'dxgi')

    if not dxgi_loaded then
        return {}
    end

    local factory = ffi.new('void *[1]')

    if dxgi.CreateDXGIFactory1(ffi.new('StatsBridgeGuid', FACTORY_INTERFACE_ID), factory) ~= 0 then
        return {}
    end

    local names = {}
    local enum_adapters = com_method(factory[0], ENUM_ADAPTERS1_METHOD, 'int32_t (*)(void *, uint32_t, void **)')
    local adapter = ffi.new('void *[1]')
    local position = 0

    while enum_adapters(factory[0], position, adapter) == 0 do
        local description = ffi.new('StatsBridgeAdapterDescription')

        if com_method(adapter[0], GET_DESCRIPTION1_METHOD, 'int32_t (*)(void *, StatsBridgeAdapterDescription *)')(adapter[0], description) == 0 then
            names[adapter_key(description.luidHighPart, description.luidLowPart)] = from_wide_string(description.description)
        end

        release(adapter[0])
        position = position + 1
    end

    release(factory[0])

    return names
end

local function open_gpu_counters(pdh)
    local query = ffi.new('void *[1]')

    if pdh.PdhOpenQueryW(nil, 0, query) ~= 0 then
        return nil
    end

    local counters = {}

    for key, path in pairs({
        engine = ENGINE_COUNTER_PATH,
        dedicated = DEDICATED_MEMORY_COUNTER_PATH,
        shared = SHARED_MEMORY_COUNTER_PATH,
    }) do
        local counter = ffi.new('void *[1]')

        if pdh.PdhAddEnglishCounterW(query[0], to_wide_string(path), 0, counter) ~= 0 then
            pdh.PdhCloseQuery(query[0])

            return nil
        end

        counters[key] = counter
    end

    pdh.PdhCollectQueryData(query[0])

    return {pdh = pdh, query = query, counters = counters}
end

local function open_hardware()
    if not ffi_loaded or ffi.os ~= 'Windows' then
        return nil
    end

    define_native_types()

    local pdh_loaded, pdh = pcall(ffi.load, 'pdh')

    local gpu = pdh_loaded and open_gpu_counters(pdh) or nil

    if gpu ~= nil then
        local names_loaded, names = pcall(read_adapter_names)

        gpu.adapter_names = names_loaded and names or {}
    end

    return {gpu = gpu}
end

local function close_hardware()
    if hardware ~= nil and hardware.gpu ~= nil then
        hardware.gpu.pdh.PdhCloseQuery(hardware.gpu.query[0])
    end

    hardware = nil
end

local function read_counter(gpu, counter)
    local buffer_size = ffi.new('uint32_t[1]', 0)
    local item_count = ffi.new('uint32_t[1]', 0)

    if gpu.pdh.PdhGetFormattedCounterArrayW(counter[0], PDH_FORMAT_DOUBLE_UNCAPPED, buffer_size, item_count, nil) ~= PDH_MORE_DATA then
        return {}
    end

    local buffer = ffi.new('uint8_t[?]', buffer_size[0])
    local items = ffi.cast('StatsBridgeCounterItem *', buffer)

    if gpu.pdh.PdhGetFormattedCounterArrayW(counter[0], PDH_FORMAT_DOUBLE_UNCAPPED, buffer_size, item_count, items) ~= 0 then
        return {}
    end

    local values = {}

    for position = 0, item_count[0] - 1 do
        local item = items[position]

        if PDH_VALID_DATA_STATUSES[item.value.status] then
            values[#values + 1] = {name = from_wide_string(item.name), value = item.value.doubleValue}
        end
    end

    return values
end

local function read_adapter_loads(gpu)
    local engine_loads = {}

    for _position, item in ipairs(read_counter(gpu, gpu.counters.engine)) do
        local adapter, engine, engine_type = string.match(item.name, 'luid_(0x%x+_0x%x+_phys_%d+)_eng_(%d+)_engtype_(.*)$')

        if adapter ~= nil then
            local key = adapter .. '|' .. engine
            local load = engine_loads[key] or {adapter = adapter, engine_type = engine_type, value = 0}

            load.value = load.value + item.value
            engine_loads[key] = load
        end
    end

    local adapters = {}

    for _key, load in pairs(engine_loads) do
        local adapter = adapters[load.adapter] or {usage = 0, encoder = 0, dedicated = 0, shared = 0}

        if load.engine_type == '3D' then
            adapter.usage = math.max(adapter.usage, load.value)
        elseif string.find(load.engine_type, 'Encode') or string.find(load.engine_type, 'Codec') then
            adapter.encoder = math.max(adapter.encoder, load.value)
        end

        adapters[load.adapter] = adapter
    end

    return adapters
end

local function read_adapter_memory(gpu, adapters, counter, field)
    for _position, item in ipairs(read_counter(gpu, counter)) do
        local adapter = adapters[string.match(item.name, 'luid_(0x%x+_0x%x+_phys_%d+)')]

        if adapter ~= nil then
            adapter[field] = item.value
        end
    end
end

local function sample_gpu(gpu)
    if gpu.pdh.PdhCollectQueryData(gpu.query[0]) ~= 0 then
        return nil
    end

    local adapters = read_adapter_loads(gpu)

    read_adapter_memory(gpu, adapters, gpu.counters.dedicated, 'dedicated')
    read_adapter_memory(gpu, adapters, gpu.counters.shared, 'shared')

    local busiest = nil

    for key, adapter in pairs(adapters) do
        adapter.name = gpu.adapter_names[string.lower(string.match(key, '^(0x%x+_0x%x+)'))]

        if busiest == nil
            or adapter.usage > busiest.usage
            or (adapter.usage == busiest.usage and adapter.dedicated > busiest.dedicated) then
            busiest = adapter
        end
    end

    if busiest == nil then
        return nil
    end

    local is_shared_memory = busiest.dedicated < DEDICATED_MEMORY_MIN_BYTES

    return string.format(
        '{"name":%s,"usage":%.1f,"encoder":%.1f,"memoryInBytes":%.0f,"isSharedMemory":%s}',
        busiest.name ~= nil and json_string(busiest.name) or 'null',
        math.min(busiest.usage, 100),
        math.min(busiest.encoder, 100),
        is_shared_memory and busiest.shared or busiest.dedicated,
        tostring(is_shared_memory)
    )
end

local function sample_system_memory()
    local status = ffi.new('StatsBridgeMemoryStatus')

    status.length = ffi.sizeof(status)

    if ffi.C.GlobalMemoryStatusEx(status) == 0 then
        return nil
    end

    return string.format(
        '{"used":%.0f,"total":%.0f}',
        tonumber(status.totalPhysical - status.availablePhysical),
        tonumber(status.totalPhysical)
    )
end

local function collect_hardware()
    if hardware == nil then
        return ''
    end

    local parts = {}
    local gpu = hardware.gpu ~= nil and sample_gpu(hardware.gpu) or nil
    local memory_loaded, memory = pcall(sample_system_memory)

    if gpu ~= nil then
        parts[#parts + 1] = ',"gpu":' .. gpu
    end

    if memory_loaded and memory ~= nil then
        parts[#parts + 1] = ',"systemMemory":' .. memory
    end

    return table.concat(parts)
end

local stream_outputs = nil

local function define_output_types()
    pcall(ffi.cdef, [[
        void obs_enum_outputs(bool (*enum_proc)(void *param, void *output), void *param);
        const char *obs_output_get_name(const void *output);
        void *obs_output_get_service(const void *output);
        const char *obs_service_get_connect_info(const void *service, uint32_t type);
        void *obs_service_get_settings(const void *service);
        const char *obs_data_get_string(void *data, const char *name);
        void obs_data_release(void *data);
    ]])
end

local function native_service_server(libobs, service)
    local server = libobs.obs_service_get_connect_info(service, SERVER_URL_INFO)

    if server ~= nil and server[0] ~= 0 then
        return ffi.string(server)
    end

    local settings = libobs.obs_service_get_settings(service)

    if settings == nil then
        return nil
    end

    local setting = libobs.obs_data_get_string(settings, 'server')
    local result = setting ~= nil and ffi.string(setting) or nil

    libobs.obs_data_release(settings)

    return result
end

local function open_stream_outputs()
    if not ffi_loaded then
        return nil
    end

    define_output_types()

    local libobs_loaded, libobs = pcall(ffi.load, 'obs')

    if not libobs_loaded then
        return nil
    end

    local found = {}

    local visit = ffi.cast('bool (*)(void *, void *)', function(_param, output)
        local service = libobs.obs_output_get_service(output)

        if service ~= nil then
            local name = libobs.obs_output_get_name(output)

            if name ~= nil then
                found[#found + 1] = {name = ffi.string(name), server = native_service_server(libobs, service)}
            end
        end

        return true
    end)

    return {
        libobs = libobs,
        visit = visit,
        found = found,
    }
end

local function close_stream_outputs()
    if stream_outputs ~= nil then
        stream_outputs.visit:free()
        stream_outputs = nil
    end
end

local function read_stream_outputs()
    if stream_outputs == nil then
        return nil
    end

    local found = stream_outputs.found

    for index = #found, 1, -1 do
        found[index] = nil
    end

    stream_outputs.libobs.obs_enum_outputs(stream_outputs.visit, nil)

    local outputs = {}

    for _index, output in ipairs(found) do
        outputs[#outputs + 1] = {name = output.name, server = server_origin(output.server)}
    end

    return outputs
end

local function read_named_outputs()
    local outputs = {}

    for _index, name in ipairs(OUTPUT_NAMES) do
        outputs[#outputs + 1] = {name = name, server = output_server(name)}
    end

    return outputs
end

local function collect()
    local items = {}
    local enumerated, outputs = pcall(read_stream_outputs)

    if not enumerated or outputs == nil then
        outputs = read_named_outputs()
    end

    for _index, output in ipairs(outputs) do
        if output.server ~= nil then
            items[#items + 1] = '{"name":' .. json_string(output.name) .. ',"server":' .. json_string(output.server) .. '}'
        end
    end

    return '{"updated":' .. os.time() .. ',"outputs":[' .. table.concat(items, ',') .. ']' .. collect_hardware() .. '}'
end

local function publish()
    local config = obs.obs_frontend_get_profile_config()

    if config ~= nil then
        obs.config_set_string(config, SECTION, PARAM, collect())
    end
end

local function clear()
    local config = obs.obs_frontend_get_profile_config()

    if config ~= nil then
        obs.config_remove_value(config, SECTION, PARAM)
    end
end

local function on_event(event)
    if event == obs.OBS_FRONTEND_EVENT_PROFILE_CHANGING or event == obs.OBS_FRONTEND_EVENT_SCRIPTING_SHUTDOWN then
        clear()

        if event == obs.OBS_FRONTEND_EVENT_SCRIPTING_SHUTDOWN then
            close_hardware()
            close_stream_outputs()
        end
    elseif event == obs.OBS_FRONTEND_EVENT_PROFILE_CHANGED then
        publish()
    end
end

function script_description()
    if string.sub(obs.obs_get_locale(), 1, 2) == 'ru' then
        return 'Сообщает панели obs-stats-frog-widget, на какую площадку стримят выходы плагинов (obs-multi-rtmp и любые другие), ' ..
            'загрузку видеокарты и занятую память системы. Передаёт только адрес сервера без пути и ключа.'
    end

    return 'Tells the obs-stats-frog-widget dock which platform plugin outputs stream to (obs-multi-rtmp and any other), ' ..
        'the GPU load and the system memory in use. Only the server address is passed, without the path or the key.'
end

function script_load(settings)
    local hardware_loaded, opened = pcall(open_hardware)

    hardware = hardware_loaded and opened or nil

    local outputs_loaded, outputs_opened = pcall(open_stream_outputs)

    stream_outputs = outputs_loaded and outputs_opened or nil

    obs.obs_frontend_add_event_callback(on_event)
    obs.timer_add(publish, INTERVAL_MS)
    publish()
end

function script_unload()
    obs.timer_remove(publish)
    close_hardware()
    close_stream_outputs()
end
