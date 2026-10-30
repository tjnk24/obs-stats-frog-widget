$ErrorActionPreference = 'Stop'

Import-Module Pester -MinimumVersion 5.0

$configuration = New-PesterConfiguration
$configuration.Run.Path = $PSScriptRoot
$configuration.Run.Exit = $true
$configuration.Output.Verbosity = 'Normal'

Invoke-Pester -Configuration $configuration
