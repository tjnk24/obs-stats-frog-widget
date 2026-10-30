local ffi = require('ffi')

local QUESTION_MARK = 63

local wide_string = {}

function wide_string.from_text(text)
    local buffer = ffi.new('uint16_t[?]', #text + 1)

    for position = 1, #text do
        buffer[position - 1] = string.byte(text, position)
    end

    return buffer
end

function wide_string.to_text(pointer)
    local characters = {}
    local position = 0

    while pointer[position] ~= 0 do
        local code = pointer[position]

        characters[#characters + 1] = string.char(code < 128 and code or QUESTION_MARK)
        position = position + 1
    end

    return table.concat(characters)
end

return wide_string
