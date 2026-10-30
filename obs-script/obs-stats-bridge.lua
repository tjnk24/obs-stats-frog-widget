local obs = obslua

local consts = require('obs-stats-bridge.consts')
local Gpu = require('obs-stats-bridge.hardware.gpu')
local StreamOutputs = require('obs-stats-bridge.outputs.stream_outputs')
local publisher = require('obs-stats-bridge.publisher')

local sources = {}

local function create_safely(Source)
    local created, source = pcall(Source.new)

    return created and source or nil
end

local function open_sources()
    sources = {
        gpu = create_safely(Gpu),
        stream_outputs = create_safely(StreamOutputs),
    }
end

local function close_sources()
    for _key, source in pairs(sources) do
        source:close()
    end

    sources = {}
end

local function publish()
    publisher.publish(sources)
end

local function on_event(event)
    if event == obs.OBS_FRONTEND_EVENT_PROFILE_CHANGING then
        publisher.clear()
    elseif event == obs.OBS_FRONTEND_EVENT_PROFILE_CHANGED then
        publish()
    elseif event == obs.OBS_FRONTEND_EVENT_SCRIPTING_SHUTDOWN then
        publisher.clear()
        close_sources()
    end
end

function script_description()
    if string.sub(obs.obs_get_locale(), 1, 2) == 'ru' then
        return 'Сообщает панели obs-stats-widget, на какую площадку стримят выходы плагинов (obs-multi-rtmp и любые другие), ' ..
            'загрузку видеокарты и занятую память системы. Передаёт только адрес сервера без пути и ключа.'
    end

    return 'Tells the obs-stats-widget dock which platform plugin outputs stream to (obs-multi-rtmp and any other), ' ..
        'the GPU load and the system memory in use. Only the server address is passed, without the path or the key.'
end

function script_load(_settings)
    open_sources()

    obs.obs_frontend_add_event_callback(on_event)
    obs.timer_add(publish, consts.PUBLISH_INTERVAL_MS)
    publish()
end

function script_unload()
    obs.timer_remove(publish)
    close_sources()
end
