$script:StrictUtf8 = [System.Text.UTF8Encoding]::new($false, $true)

function Read-TextFile {
    param(
        [Parameter(Mandatory)][string]$Path
    )

    $bytes = [System.IO.File]::ReadAllBytes($Path)
    $hasBom = $bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF
    $offset = if ($hasBom) { 3 } else { 0 }

    return [pscustomobject]@{
        Path = $Path
        Text = $script:StrictUtf8.GetString($bytes, $offset, $bytes.Length - $offset)
        HasBom = $hasBom
    }
}
