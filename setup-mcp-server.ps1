# Quick Setup Script for MCP Server

Write-Host "Setting up MCP Server..." -ForegroundColor Cyan

# Navigate to mcp-server directory
cd mcp-server

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "✅ MCP Server setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Files created:" -ForegroundColor Cyan
Write-Host "  - package-lock.json" -ForegroundColor White
Write-Host "  - node_modules/" -ForegroundColor White
Write-Host ""

# Go back to root
cd ..

Write-Host "Now you can commit and push:" -ForegroundColor Yellow
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m 'Add MCP server files'" -ForegroundColor White
Write-Host "  git push origin main" -ForegroundColor White
