local obs = obslua

local consts = require('obs-stats-bridge.consts')
local system_memory = require('obs-stats-bridge.hardware.system_memory')
local targets = require('obs-stats-bridge.outputs.targets')
local json = require('obs-stats-bridge.utils.json')

local publisher = {}

local function sample_safely(sample, ...)
    local sampled, result = pcall(sample, ...)

    return sampled and result or nil
end

local function build_payload(sources)
    return {
        bridgeVersion = consts.BRIDGE_VERSION,
        updated = os.time(),
        outputs = json.array(targets.read(sources.stream_outputs)),
        gpu = sources.gpu ~= nil and sample_safely(sources.gpu.sample, sources.gpu) or nil,
        systemMemory = sample_safely(system_memory.sample),
    }
end

function publisher.publish(sources)
    local config = obs.obs_frontend_get_profile_config()

    if config ~= nil then
        obs.config_set_string(config, consts.PARAMETER_SECTION, consts.PARAMETER_NAME, json.encode(build_payload(sources)))
    end
end

function publisher.clear()
    local config = obs.obs_frontend_get_profile_config()

    if config ~= nil then
        obs.config_remove_value(config, consts.PARAMETER_SECTION, consts.PARAMETER_NAME)
    end
end

return publisher
