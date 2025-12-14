$backup=Join-Path -Path (Get-Location) -ChildPath ('backup_yandex_'+(Get-Date -Format yyyyMMddHHmmss))
New-Item -ItemType Directory -Force -Path $backup | Out-Null
Get-ChildItem -Path (Get-Location) -Filter '*.html' -File | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $backup
    $content = Get-Content -Raw -Encoding UTF8 -Path $_.FullName
    $new = [regex]::Replace($content, '(?s)<!--\s*Yandex\.Metrika counter\s*-->.*?<!--\s*/Yandex\.Metrika counter\s*-->', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $opts = [System.Text.RegularExpressions.RegexOptions]::Singleline -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
        $new = [regex]::Replace($new, '<script\b[^>]*mc\.yandex\.ru/metrika/tag\.js[^>]*>.*?</script\s*>', '', $opts)
        $new = [regex]::Replace($new, "ym\s*\(\s*91144930[\s\S]*?\)\s*;", '', $opts)
    $new = [regex]::Replace($new, 'https?://mc\.yandex\.ru/watch/\d+', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if($content -ne $new){
        Set-Content -Path $_.FullName -Encoding UTF8 -Value $new
        Write-Output ('Updated: '+$_.FullName)
    }
}
Write-Output "Backup created at: $backup"