function Get-JsonMember {
    param(
        [AllowNull()]$Node,
        [Parameter(Mandatory)][string]$Key
    )

    if ($null -eq $Node -or $Node.Kind -ne 'object') {
        return $null
    }

    foreach ($member in $Node.Members) {
        if ($member.Key -ceq $Key) {
            return $member.Value
        }
    }

    return $null
}
