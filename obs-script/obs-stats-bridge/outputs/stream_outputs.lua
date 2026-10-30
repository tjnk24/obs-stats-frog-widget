local ffi = require('ffi')

local consts = require('obs-stats-bridge.consts')

local StreamOutputs = {}

StreamOutputs.__index = StreamOutputs

local function define_types()
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

local function read_service_server(self, service)
    local server = self.libobs.obs_service_get_connect_info(service, consts.SERVER_URL_INFO)

    if server ~= nil and server[0] ~= 0 then
        return ffi.string(server)
    end

    local settings = self.libobs.obs_service_get_settings(service)

    if settings == nil then
        return nil
    end

    local setting = self.libobs.obs_data_get_string(settings, 'server')
    local result = setting ~= nil and ffi.string(setting) or nil

    self.libobs.obs_data_release(settings)

    return result
end

local function visit_output(self, output)
    local service = self.libobs.obs_output_get_service(output)

    if service == nil then
        return
    end

    local name = self.libobs.obs_output_get_name(output)

    if name ~= nil then
        self.found[#self.found + 1] = {name = ffi.string(name), server = read_service_server(self, service)}
    end
end

function StreamOutputs.new()
    local self = setmetatable({found = {}}, StreamOutputs)

    define_types()

    local libobs_loaded, libobs = pcall(ffi.load, 'obs')

    if not libobs_loaded then
        return self
    end

    self.libobs = libobs
    self.visit = ffi.cast('bool (*)(void *, void *)', function(_param, output)
        visit_output(self, output)

        return true
    end)

    return self
end

function StreamOutputs:close()
    if self.visit ~= nil then
        self.visit:free()
    end

    self.visit = nil
end

function StreamOutputs:read()
    if self.visit == nil then
        return nil
    end

    self.found = {}
    self.libobs.obs_enum_outputs(self.visit, nil)

    return self.found
end

return StreamOutputs
