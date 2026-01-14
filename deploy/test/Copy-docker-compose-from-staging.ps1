param(
    [string]$VpsHost = "46.224.53.52",
    [string]$User = "root",
    [string]$RemotePath = "/opt/apps/badmik/docker-compose.yml",
    [string]$LocalDir = "C:\Users\rmy\Desktop\Badminton\Repos\deploy\test"
)

$localFile = Join-Path $LocalDir "docker-compose.yml"

Write-Host "=== Copying docker-compose.yml from ${User}@${VpsHost} ==="
Write-Host "Remote: $RemotePath"
Write-Host "Local : $localFile"

# Ensure local dir exists
New-Item -ItemType Directory -Force -Path $LocalDir | Out-Null

scp "${User}@${VpsHost}:${RemotePath}" "$localFile"

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Failed to copy docker-compose.yml"
    exit 1
}

Write-Host "✅ Copied successfully: $localFile"