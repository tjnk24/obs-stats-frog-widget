function Test-SamePath {
    param(
        [AllowNull()][AllowEmptyString()][string]$First,
        [AllowNull()][AllowEmptyString()][string]$Second
    )

    if ([string]::IsNullOrEmpty($First) -or [string]::IsNullOrEmpty($Second)) {
        return $false
    }

    return $First.Replace('\', '/').TrimEnd('/') -eq $Second.Replace('\', '/').TrimEnd('/')
}
