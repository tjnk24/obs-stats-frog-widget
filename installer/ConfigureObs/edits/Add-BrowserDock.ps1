function Add-BrowserDock {
    param(
        [AllowNull()][AllowEmptyString()][string]$DocksJson,
        [Parameter(Mandatory)][string]$Title,
        [Parameter(Mandatory)][string]$Url,
        [Parameter(Mandatory)][string]$Uuid
    )

    if ([string]::IsNullOrWhiteSpace($DocksJson)) {
        $DocksJson = '[]'
    }

    $docks = Read-JsonDocument -Text $DocksJson

    if ($docks.Kind -ne 'array') {
        throw 'ExtraBrowserDocks is not a JSON array'
    }

    $titles = @()

    foreach ($dock in $docks.Items) {
        $dockUrl = Get-JsonMember -Node $dock -Key 'url'
        $dockUuid = (Get-JsonMember -Node $dock -Key 'uuid').Value

        if ($dockUrl.Value -eq $Url) {
            return [pscustomobject]@{Json = $DocksJson; Changed = $false; Uuid = $dockUuid}
        }

        if ($dockUuid -eq $Uuid -and $null -ne $dockUrl) {
            return [pscustomobject]@{
                Json = $DocksJson.Remove($dockUrl.Start, $dockUrl.End - $dockUrl.Start).Insert($dockUrl.Start, (ConvertTo-JsonText -Value $Url))
                Changed = $true
                Uuid = $Uuid
            }
        }

        $titles += (Get-JsonMember -Node $dock -Key 'title').Value
    }

    $uniqueTitle = $Title
    $suffix = 2

    while ($titles -contains $uniqueTitle) {
        $uniqueTitle = "$Title ($suffix)"
        $suffix += 1
    }

    $entry = '{"title": ' + (ConvertTo-JsonText -Value $uniqueTitle) + ', "url": ' + (ConvertTo-JsonText -Value $Url) + ', "uuid": ' + (ConvertTo-JsonText -Value $Uuid) + '}'

    if ($docks.Items.Count -eq 0) {
        $json = '[' + $entry + ']'
    } else {
        $json = $DocksJson.Insert($docks.Items[$docks.Items.Count - 1].End, ', ' + $entry)
    }

    return [pscustomobject]@{Json = $json; Changed = $true; Uuid = $Uuid}
}
