function Add-BridgeScript {
    param(
        [Parameter(Mandatory)][string]$CollectionText,
        [Parameter(Mandatory)][string]$ScriptPath
    )

    $root = Read-JsonDocument -Text $CollectionText

    if ($root.Kind -ne 'object') {
        throw 'The scene collection is not a JSON object'
    }

    $entry = '{"path": ' + (ConvertTo-JsonText -Value $ScriptPath.Replace('\', '/')) + ', "settings": {}}'
    $modules = Get-JsonMember -Node $root -Key 'modules'

    if ($null -eq $modules) {
        $separator = if ($root.Members.Count -gt 0) { ', ' } else { '' }

        return [pscustomobject]@{
            Text = $CollectionText.Insert($root.Start + 1, '"modules": {"scripts-tool": [' + $entry + ']}' + $separator)
            Changed = $true
        }
    }

    if ($modules.Kind -ne 'object') {
        throw 'modules is not a JSON object'
    }

    $scripts = Get-JsonMember -Node $modules -Key 'scripts-tool'

    if ($null -eq $scripts) {
        $separator = if ($modules.Members.Count -gt 0) { ', ' } else { '' }

        return [pscustomobject]@{
            Text = $CollectionText.Insert($modules.Start + 1, '"scripts-tool": [' + $entry + ']' + $separator)
            Changed = $true
        }
    }

    if ($scripts.Kind -ne 'array') {
        throw 'scripts-tool is not a JSON array'
    }

    foreach ($existingScript in $scripts.Items) {
        if (Test-SamePath -First (Get-JsonMember -Node $existingScript -Key 'path').Value -Second $ScriptPath) {
            return [pscustomobject]@{Text = $CollectionText; Changed = $false}
        }
    }

    if ($scripts.Items.Count -eq 0) {
        $text = $CollectionText.Remove($scripts.Start, $scripts.End - $scripts.Start).Insert($scripts.Start, '[' + $entry + ']')
    } else {
        $text = $CollectionText.Insert($scripts.Items[$scripts.Items.Count - 1].End, ', ' + $entry)
    }

    return [pscustomobject]@{Text = $text; Changed = $true}
}
