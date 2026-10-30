local obs = obslua

local consts = require('obs-stats-bridge.consts')

local named_outputs = {}

local function read_server(name)
    local output = obs.obs_get_output_by_name(name)

    if output == nil then
        return nil
    end

    local server = nil
    local service = obs.obs_output_get_service(output)

    if service ~= nil then
        server = obs.obs_service_get_connect_info(service, consts.SERVER_URL_INFO)

        if server == nil or server == '' then
            local settings = obs.obs_service_get_settings(service)

            server = obs.obs_data_get_string(settings, 'server')
            obs.obs_data_release(settings)
        end
    end

    obs.obs_output_release(output)

    return server
end

function named_outputs.read()
    local outputs = {}

    for _index, name in ipairs(consts.FALLBACK_OUTPUT_NAMES) do
        outputs[#outputs + 1] = {name = name, server = read_server(name)}
    end

    return outputs
end

return named_outputs
