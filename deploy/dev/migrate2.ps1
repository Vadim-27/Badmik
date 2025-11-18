# migrate2.ps1  (place in deploy/dev)

# Resolve repo root (two levels up from deploy/dev)
$repo = (Resolve-Path "$PSScriptRoot\..\..").Path

Write-Host "Restoring and building inside a clean SDK container..."
docker run --rm -it -v "${repo}:/src" -w /src mcr.microsoft.com/dotnet/sdk:9.0 `
  bash -lc "dotnet restore BadmintonApp.sln && dotnet build BadmintonApp.sln -c Release -v minimal"
if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed. See errors above."
  exit 1
}

Write-Host "Creating migration (if needed) and updating database..."
# IMPORTANT: keep the bash command on ONE line and do not let PowerShell see $PATH directly.
$cmd = 'dotnet tool install -g dotnet-ef >/dev/null 2>&1 || true; export PATH="$PATH:/root/.dotnet/tools"; dotnet ef database update --project src/BadmintonApp.Infrastructure --startup-project src/BadmintonApp.API --context ApplicationDbContext'
docker run --rm -it -v "${repo}:/src" -w /src mcr.microsoft.com/dotnet/sdk:9.0 bash -lc "$cmd"
if ($LASTEXITCODE -ne 0) {
  Write-Host "Migration failed. See errors above."
  exit 1
}

Write-Host "Done."