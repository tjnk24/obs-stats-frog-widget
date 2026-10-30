function Test-ObsRunning {
    return $null -ne (Get-Process -Name 'obs64', 'obs32' -ErrorAction SilentlyContinue | Select-Object -First 1)
}
