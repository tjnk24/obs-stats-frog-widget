function Enable-WebSocketServer {
    param(
        [Parameter(Mandatory)][string]$ConfigText
    )

    $root = Read-JsonDocument -Text $ConfigText

    if ($root.Kind -ne 'object') {
        throw 'The obs-websocket config is not a JSON object'
    }

    $enabled = Get-JsonMember -Node $root -Key 'server_enabled'

    if ($null -eq $enabled) {
        $separator = if ($root.Members.Count -gt 0) { ', ' } else { '' }

        return [pscustomobject]@{Text = $ConfigText.Insert($root.Start + 1, '"server_enabled": true' + $separator); Changed = $true}
    }

    if ($enabled.Value -eq 'true') {
        return [pscustomobject]@{Text = $ConfigText; Changed = $false}
    }

    return [pscustomobject]@{
        Text = $ConfigText.Remove($enabled.Start, $enabled.End - $enabled.Start).Insert($enabled.Start, 'true')
        Changed = $true
    }
}
