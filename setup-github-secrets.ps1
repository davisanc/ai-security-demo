# Setup Script for GitHub Secrets

Write-Host "🔐 Setting up Azure credentials for GitHub Actions..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Login to Azure
Write-Host "Step 1: Logging into Azure..." -ForegroundColor Yellow
az login

# Step 2: Get your subscription ID
Write-Host ""
Write-Host "Step 2: Getting subscription ID..." -ForegroundColor Yellow
$subscriptionId = az account show --query id -o tsv
Write-Host "Subscription ID: $subscriptionId" -ForegroundColor Green

# Step 3: Create service principal
Write-Host ""
Write-Host "Step 3: Creating service principal for GitHub Actions..." -ForegroundColor Yellow
$servicePrincipal = az ad sp create-for-rbac `
  --name "ai-security-demo-github-actions" `
  --role contributor `
  --scopes /subscriptions/$subscriptionId `
  --sdk-auth

Write-Host ""
Write-Host "✅ Service Principal created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 COPY THIS JSON - You'll need it for GitHub Secrets" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host $servicePrincipal -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Copy the JSON above" -ForegroundColor White
Write-Host "2. Go to: https://github.com/davisanc/ai-security-demo/settings/secrets/actions" -ForegroundColor White
Write-Host "3. Click 'New repository secret'" -ForegroundColor White
Write-Host "4. Name: AZURE_CREDENTIALS" -ForegroundColor White
Write-Host "5. Paste the JSON as the value" -ForegroundColor White
Write-Host ""
Write-Host "You'll also need to add these secrets (use values from your .env file):" -ForegroundColor Yellow
Write-Host "  - AZURE_OPENAI_ENDPOINT" -ForegroundColor White
Write-Host "  - AZURE_OPENAI_API_KEY" -ForegroundColor White
Write-Host "  - AZURE_OPENAI_DEPLOYMENT" -ForegroundColor White
Write-Host "  - AZURE_OPENAI_API_VERSION" -ForegroundColor White
Write-Host "  - MCP_API_KEY (optional - create a random string if needed)" -ForegroundColor White
Write-Host ""
