-- obs-websocket lists plugin outputs (obs-multi-rtmp names every target's output "multi-output")
-- but not their servers, so the dock cannot tell a Twitch target from a YouTube one. This script
-- looks the server up inside OBS (output -> service -> server URL) every few seconds and publishes
-- only its scheme and host, never the stream key or the URL path, as the profile parameter
-- [ObsStatsDock] PluginOutputs, which the dock reads with GetProfileParameter.

obs = obslua

local SECTION = 'ObsStatsDock'
local PARAM = 'PluginOutputs'
local OUTPUT_NAMES = {'multi-output'}
local INTERVAL_MS = 3000
local SERVER_URL_INFO = 0 -- OBS_SERVICE_CONNECT_INFO_SERVER_URL

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

local function collect()
    local items = {}

    for _index, name in ipairs(OUTPUT_NAMES) do
        local server = output_server(name)

        if server ~= nil then
            items[#items + 1] = '{"name":' .. json_string(name) .. ',"server":' .. json_string(server) .. '}'
        end
    end

    return '{"updated":' .. os.time() .. ',"outputs":[' .. table.concat(items, ',') .. ']}'
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
    elseif event == obs.OBS_FRONTEND_EVENT_PROFILE_CHANGED then
        publish()
    end
end

function script_description()
    return 'Сообщает панели stats-sorayuki-frog-widget, на какую площадку стримят выходы плагинов (obs-multi-rtmp). ' ..
        'Передаёт только адрес сервера без пути и ключа.'
end

function script_load(settings)
    obs.obs_frontend_add_event_callback(on_event)
    obs.timer_add(publish, INTERVAL_MS)
    publish()
end

function script_unload()
    obs.timer_remove(publish)
end
