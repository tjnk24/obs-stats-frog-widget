function Get-IniValue {
    param(
        [Parameter(Mandatory)][AllowEmptyString()][string]$Text,
        [Parameter(Mandatory)][string]$Section,
        [Parameter(Mandatory)][string]$Key
    )

    $isInSection = $false

    foreach ($line in $Text -split '\r?\n') {
        $trimmed = $line.Trim()

        if ($trimmed.StartsWith('[') -and $trimmed.EndsWith(']')) {
            $isInSection = $trimmed -eq "[$Section]"

            continue
        }

        if ($isInSection -and $line.StartsWith("$Key=")) {
            return $line.Substring($Key.Length + 1)
        }
    }

    return $null
}
