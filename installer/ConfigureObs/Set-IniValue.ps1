function Set-IniValue {
    param(
        [Parameter(Mandatory)][AllowEmptyString()][string]$Text,
        [Parameter(Mandatory)][string]$Section,
        [Parameter(Mandatory)][string]$Key,
        [Parameter(Mandatory)][AllowEmptyString()][string]$Value
    )

    $newline = if ($Text.Contains("`r`n")) { "`r`n" } else { "`n" }
    $lines = [System.Collections.Generic.List[string]]::new([string[]]($Text -split '\r?\n'))
    $sectionLine = -1

    for ($lineIndex = 0; $lineIndex -lt $lines.Count; $lineIndex++) {
        $trimmed = $lines[$lineIndex].Trim()

        if ($trimmed.StartsWith('[') -and $trimmed.EndsWith(']')) {
            if ($sectionLine -ge 0) {
                break
            }

            if ($trimmed -eq "[$Section]") {
                $sectionLine = $lineIndex
            }

            continue
        }

        if ($sectionLine -ge 0 -and $lines[$lineIndex].StartsWith("$Key=")) {
            $lines[$lineIndex] = "$Key=$Value"

            return $lines -join $newline
        }
    }

    if ($sectionLine -ge 0) {
        $lines.Insert($sectionLine + 1, "$Key=$Value")

        return $lines -join $newline
    }

    $ending = if ($Text.Length -eq 0 -or $Text.EndsWith("`n")) { '' } else { $newline }

    return $Text + $ending + "[$Section]" + $newline + "$Key=$Value" + $newline
}
