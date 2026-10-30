function ConvertTo-FileUrl {
    param(
        [Parameter(Mandatory)][string]$Path
    )

    return [System.Uri]::new([System.IO.Path]::GetFullPath($Path)).AbsoluteUri
}
