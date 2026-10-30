local ffi = require('ffi')

local wide_string = require('obs-stats-bridge.utils.wide_string')

local FACTORY_INTERFACE_ID = {0x770aae78, 0xf26f, 0x4dba, {0xa8, 0x29, 0x25, 0x3c, 0x83, 0xd1, 0xb3, 0x87}}
local RELEASE_METHOD = 2
local ENUM_ADAPTERS1_METHOD = 12
local GET_DESCRIPTION1_METHOD = 10

local gpu_names = {}

local function define_types()
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

local function com_method(object, position, signature)
    return ffi.cast(signature, ffi.cast('void ***', object)[0][position])
end

local function release(object)
    com_method(object, RELEASE_METHOD, 'uint32_t (*)(void *)')(object)
end

local function adapter_key(high_part, low_part)
    return string.format('0x%08x_0x%08x', bit.band(high_part, 0xffffffff), low_part)
end

function gpu_names.read()
    define_types()

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
    local get_description = 'int32_t (*)(void *, StatsBridgeAdapterDescription *)'
    local adapter = ffi.new('void *[1]')
    local position = 0

    while enum_adapters(factory[0], position, adapter) == 0 do
        local description = ffi.new('StatsBridgeAdapterDescription')

        if com_method(adapter[0], GET_DESCRIPTION1_METHOD, get_description)(adapter[0], description) == 0 then
            names[adapter_key(description.luidHighPart, description.luidLowPart)] = wide_string.to_text(description.description)
        end

        release(adapter[0])
        position = position + 1
    end

    release(factory[0])

    return names
end

return gpu_names
