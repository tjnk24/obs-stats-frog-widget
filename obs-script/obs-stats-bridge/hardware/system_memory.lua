local ffi = require('ffi')

local system_memory = {}

local function define_types()
    pcall(ffi.cdef, [[
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

        int GlobalMemoryStatusEx(StatsBridgeMemoryStatus *status);
    ]])
end

function system_memory.sample()
    if ffi.os ~= 'Windows' then
        return nil
    end

    define_types()

    local status = ffi.new('StatsBridgeMemoryStatus')

    status.length = ffi.sizeof(status)

    if ffi.C.GlobalMemoryStatusEx(status) == 0 then
        return nil
    end

    return {
        used = tonumber(status.totalPhysical - status.availablePhysical),
        total = tonumber(status.totalPhysical),
    }
end

return system_memory
