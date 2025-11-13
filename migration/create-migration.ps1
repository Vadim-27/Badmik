param(
    [Parameter(Mandatory = $true)]
    [string]$Name
)

Write-Host "=== Creating migration: $Name ==="

$infra = "../src/BadmintonApp.Infrastructure"
$api = "../src/BadmintonApp.API"

dotnet ef migrations add $Name `
    --project $infra `
    --startup-project $api `
    --output-dir "Persistence/Migrations" `
    --verbose

if ($LASTEXITCODE -eq 0) {
    Write-Host "Migration '$Name' created successfully."
} else {
    Write-Host "Failed to create migration '$Name'."
    exit 1
}