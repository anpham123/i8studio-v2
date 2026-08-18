Get-ChildItem 'd:\Projects\i8studio-v2\src\app\[locale]' -Filter 'page.tsx' -Recurse | ForEach-Object {
    $c = Get-Content $_.FullName -Raw
    $p = if ($c -match 'prisma') { 'YES' } else { 'NO' }
    $r = if ($c -match 'revalidate') { 'YES' } else { 'NO' }
    $d = if ($c -match 'force-dynamic') { 'YES' } else { 'NO' }
    $n = $_.DirectoryName.Replace('d:\Projects\i8studio-v2\src\app\[locale]\','')
    Write-Host "$n | db=$p | reval=$r | dyn=$d"
}
