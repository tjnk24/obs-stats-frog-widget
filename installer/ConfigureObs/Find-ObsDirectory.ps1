function Find-ObsDirectory {
    $registryKeys = @(
        'HKLM:\SOFTWARE\OBS Studio',
        'HKLM:\SOFTWARE\WOW6432Node\OBS Studio',
        'HKCU:\SOFTWARE\OBS Studio'
    )

    foreach ($registryKey in $registryKeys) {
        $installPath = (Get-ItemProperty -Path $registryKey -ErrorAction SilentlyContinue).'(default)'

        if (-not [string]::IsNullOrEmpty($installPath) -and (Test-Path -LiteralPath (Join-Path $installPath 'bin\64bit\obs64.exe'))) {
            return $installPath
        }
    }

    return $null
}
