Write-Host "🚀 Applying migrations to database..."

$infra = "../src/BadmintonApp.Infrastructure"
$api = "../src/BadmintonApp.API"

dotnet ef database update `
    --project $infra `
    --startup-project $api `
    --verbose

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database updated successfully!"
} else {
    Write-Host "❌ Database update failed."
    exit 1
}