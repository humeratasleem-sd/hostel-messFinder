$source = "c:\Users\konda\OneDrive\ドキュメント\hostel-mess-finder"
$dest = "c:\Users\konda\OneDrive\Desktop\hostel-mess-finder.zip"
Compress-Archive -Path $source -DestinationPath $dest -Force
if (Test-Path $dest) {
    $size = (Get-Item $dest).Length / 1MB
    Write-Host "ZIP_SUCCESS: File created at $dest with size $([math]::Round($size, 2)) MB"
} else {
    Write-Host "ZIP_FAILED: File was not created at $dest"
}
