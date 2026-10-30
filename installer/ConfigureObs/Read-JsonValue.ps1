$script:JsonWhitespace = [regex]::new('\G[ \t\r\n]*', 'Compiled')
$script:JsonString = [regex]::new('\G"(?:[^"\\\x00-\x1F]|\\["\\/bfnrt]|\\u[0-9a-fA-F]{4})*"', 'Compiled')
$script:JsonNumber = [regex]::new('\G-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?', 'Compiled')
$script:JsonLiteral = [regex]::new('\G(?:true|false|null)', 'Compiled')

function Read-JsonValue {
    param(
        [Parameter(Mandatory)][string]$Text,
        [Parameter(Mandatory)][int]$Position
    )

    $Position += $script:JsonWhitespace.Match($Text, $Position).Length

    if ($Position -ge $Text.Length) {
        throw "Unexpected end of JSON at position $Position"
    }

    $character = $Text[$Position]

    if ($character -eq '"') {
        $token = $script:JsonString.Match($Text, $Position)

        if (-not $token.Success) {
            throw "Invalid JSON string at position $Position"
        }

        return [pscustomobject]@{
            Kind = 'string'
            Start = $Position
            End = $Position + $token.Length
            Value = [regex]::Unescape($token.Value.Substring(1, $token.Length - 2))
        }
    }

    if ($character -eq '{' -or $character -eq '[') {
        $isObject = $character -eq '{'
        $closing = if ($isObject) { '}' } else { ']' }
        $members = [System.Collections.Generic.List[object]]::new()
        $items = [System.Collections.Generic.List[object]]::new()
        $cursor = $Position + 1
        $cursor += $script:JsonWhitespace.Match($Text, $cursor).Length

        if ($cursor -lt $Text.Length -and $Text[$cursor] -eq $closing) {
            return [pscustomobject]@{Kind = if ($isObject) { 'object' } else { 'array' }; Start = $Position; End = $cursor + 1; Members = $members; Items = $items}
        }

        while ($true) {
            if ($isObject) {
                $key = Read-JsonValue -Text $Text -Position $cursor

                if ($key.Kind -ne 'string') {
                    throw "Expected a key at position $($key.Start)"
                }

                $cursor = $key.End + $script:JsonWhitespace.Match($Text, $key.End).Length

                if ($cursor -ge $Text.Length -or $Text[$cursor] -ne ':') {
                    throw "Expected ':' at position $cursor"
                }

                $value = Read-JsonValue -Text $Text -Position ($cursor + 1)
                $members.Add([pscustomobject]@{Key = $key.Value; KeyStart = $key.Start; Value = $value})
            } else {
                $value = Read-JsonValue -Text $Text -Position $cursor
                $items.Add($value)
            }

            $cursor = $value.End + $script:JsonWhitespace.Match($Text, $value.End).Length

            if ($cursor -ge $Text.Length) {
                throw "Unexpected end of JSON at position $cursor"
            }

            if ($Text[$cursor] -eq ',') {
                $cursor += 1

                continue
            }

            if ($Text[$cursor] -eq $closing) {
                return [pscustomobject]@{Kind = if ($isObject) { 'object' } else { 'array' }; Start = $Position; End = $cursor + 1; Members = $members; Items = $items}
            }

            throw "Expected ',' or '$closing' at position $cursor"
        }
    }

    $token = $script:JsonNumber.Match($Text, $Position)

    if (-not $token.Success -or $token.Length -eq 0) {
        $token = $script:JsonLiteral.Match($Text, $Position)
    }

    if (-not $token.Success -or $token.Length -eq 0) {
        throw "Unexpected character '$character' at position $Position"
    }

    return [pscustomobject]@{
        Kind = 'scalar'
        Start = $Position
        End = $Position + $token.Length
        Value = $token.Value
    }
}
