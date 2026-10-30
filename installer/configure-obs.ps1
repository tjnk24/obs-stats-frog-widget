param(
    [ValidateSet('Install', 'Uninstall')][string]$Mode = 'Install',
    [string]$InstallDirectory = $PSScriptRoot,
    [string]$ObsDirectory,
    [string]$ConfigDirectory,
    [string]$DataDirectory = (Join-Path $env:LOCALAPPDATA 'obs-stats-widget')
)

$ErrorActionPreference = 'Stop'

$env:PSModulePath = @(
    (Join-Path $env:ProgramFiles 'WindowsPowerShell\Modules'),
    (Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\Modules')
) -join ';'

Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot 'ConfigureObs') -Filter '*.ps1' -Recurse | ForEach-Object { . $_.FullName }

try {
    $result = Invoke-ConfigureObs -Mode $Mode -InstallDirectory $InstallDirectory -ObsDirectory $ObsDirectory -ConfigDirectory $ConfigDirectory -DataDirectory $DataDirectory
} catch {
    Write-ConfigureLog "Unexpected error: $($_.Exception.Message)"
    $result = [ConfigureObsResult]::Failed
}

exit [int]$result
