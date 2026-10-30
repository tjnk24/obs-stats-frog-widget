function ConvertTo-JsonText {
    param(
        [Parameter(Mandatory)][AllowEmptyString()][string]$Value
    )

    $builder = [System.Text.StringBuilder]::new('"')

    foreach ($character in $Value.ToCharArray()) {
        switch ($character) {
            '"' { [void]$builder.Append('\"') }
            '\' { [void]$builder.Append('\\') }
            default {
                if ([int]$character -lt 0x20) {
                    [void]$builder.AppendFormat('\u{0:x4}', [int]$character)
                } else {
                    [void]$builder.Append($character)
                }
            }
        }
    }

    return $builder.Append('"').ToString()
}
