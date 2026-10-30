$script:PortableMarkers = @('portable_mode', 'obs_portable_mode', 'portable_mode.txt', 'obs_portable_mode.txt')

function Test-PortableObs {
    param(
        [AllowNull()][AllowEmptyString()][string]$ObsDirectory
    )

    if ([string]::IsNullOrEmpty($ObsDirectory)) {
        return $false
    }

    foreach ($marker in $script:PortableMarkers) {
        if (Test-Path -LiteralPath (Join-Path $ObsDirectory $marker)) {
            return $true
        }
    }

    return $false
}
