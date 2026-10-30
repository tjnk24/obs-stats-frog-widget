local named_outputs = require('obs-stats-bridge.outputs.named_outputs')

local targets = {}

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

local function read_outputs(stream_outputs)
    if stream_outputs ~= nil then
        local enumerated, found = pcall(stream_outputs.read, stream_outputs)

        if enumerated and found ~= nil then
            return found
        end
    end

    return named_outputs.read()
end

function targets.read(stream_outputs)
    local result = {}

    for _index, output in ipairs(read_outputs(stream_outputs)) do
        local server = server_origin(output.server)

        if server ~= nil then
            result[#result + 1] = {name = output.name, server = server}
        end
    end

    return result
end

return targets
