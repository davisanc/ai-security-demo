# GitHub Secrets Setup Guide

## What are GitHub Secrets?

GitHub Secrets are encrypted environment variables that you set in your GitHub repository. They're used by GitHub Actions workflows to securely access sensitive information like API keys and credentials.

**Important:** These are NOT stored in your `.env` file - they're stored securely in GitHub.

## Required Secrets for This Workflow

You need to add the following secrets to your GitHub repository:

### 1. AZURE_CREDENTIALS (JSON format)

This is a service principal credential that allows GitHub Actions to deploy to Azure.

**How to get it:**

Run the PowerShell script in your terminal:

```powershell
.\setup-github-secrets.ps1
```

Or manually run:

```powershell
az login
az ad sp create-for-rbac --name "ai-security-demo-github-actions" --role contributor --scopes /subscriptions/YOUR_SUBSCRIPTION_ID --sdk-auth
```

This will output a JSON like:

```json
{
  "clientId": "xxxx",
  "clientSecret": "xxxx",
  "subscriptionId": "xxxx",
  "tenantId": "xxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

Copy the **entire JSON** - you'll paste it as the `AZURE_CREDENTIALS` secret.

### 2. AZURE_OPENAI_ENDPOINT

Your Azure OpenAI endpoint URL from your `.env` file.

Example: `https://davidsr-ai-project-resourcev2.cognitiveservices.azure.com/`

### 3. AZURE_OPENAI_API_KEY

Your Azure OpenAI API key from your `.env` file.

Example: `kN0kIf8Y2u3CCDTgVHJr86qKamfDCLmnN05spaprXLdckmQEk7gHJQQJ99BIACYeBjFXJ3w3AAAAACOGHyIl`

### 4. AZURE_OPENAI_DEPLOYMENT

Your deployment name from your `.env` file.

Example: `gpt-4o-mini`

### 5. AZURE_OPENAI_API_VERSION

Your API version from your `.env` file.

Example: `2024-12-01-preview`

### 6. MCP_API_KEY (Optional)

A secret key to secure communication between your Static Web App and MCP Server.

You can generate a random string:

```powershell
# Generate a random API key
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Or use any secure random string.

## How to Add Secrets to GitHub

### Step 1: Go to Your Repository Settings

1. Open your browser and go to:
   ```
   https://github.com/davisanc/ai-security-demo/settings/secrets/actions
   ```

   Or manually navigate:
   - Go to your GitHub repository
   - Click **Settings** (top menu)
   - Click **Secrets and variables** → **Actions** (left sidebar)

### Step 2: Add Each Secret

For each secret listed above:

1. Click the **"New repository secret"** button
2. Enter the **Name** (exactly as shown above, e.g., `AZURE_CREDENTIALS`)
3. Paste the **Value** (the actual credential)
4. Click **"Add secret"**

### Step 3: Verify All Secrets Are Added

You should see 6 secrets in your repository:

- ✅ AZURE_CREDENTIALS
- ✅ AZURE_OPENAI_ENDPOINT
- ✅ AZURE_OPENAI_API_KEY
- ✅ AZURE_OPENAI_DEPLOYMENT
- ✅ AZURE_OPENAI_API_VERSION
- ✅ MCP_API_KEY

## Quick Reference Table

| Secret Name | Where to Get It | Example |
|-------------|----------------|---------|
| `AZURE_CREDENTIALS` | Run `setup-github-secrets.ps1` | `{...JSON...}` |
| `AZURE_OPENAI_ENDPOINT` | Your `.env` file | `https://....cognitiveservices.azure.com/` |
| `AZURE_OPENAI_API_KEY` | Your `.env` file | `kN0kIf8Y2u3C...` |
| `AZURE_OPENAI_DEPLOYMENT` | Your `.env` file | `gpt-4o-mini` |
| `AZURE_OPENAI_API_VERSION` | Your `.env` file | `2024-12-01-preview` |
| `MCP_API_KEY` | Generate random string | `a8f3k2j9d...` |

## After Adding Secrets

Once all secrets are added:

1. **Commit and push** your changes to GitHub:
   ```bash
   git add .
   git commit -m "Add deployment workflow"
   git push origin main
   ```

2. **Watch the deployment**:
   - Go to the **Actions** tab in your GitHub repository
   - You'll see the workflow running
   - Click on it to see progress

3. **Get your deployed URLs**:
   - The workflow will output the URLs at the end
   - Or check the Azure Portal for your resources

## Troubleshooting

### "Failed to authenticate" error

- Check that `AZURE_CREDENTIALS` is valid JSON
- Verify the service principal has correct permissions
- Ensure you copied the entire JSON output

### "Secret not found" error

- Double-check the secret names match exactly (case-sensitive)
- Make sure you added secrets to the repository (not your profile)

### "Azure CLI command failed" error

- Verify your Azure subscription is active
- Check that you have sufficient permissions
- Ensure resource names don't already exist

## Security Notes

- ⚠️ **Never commit secrets to your repository**
- ⚠️ **GitHub Secrets are encrypted and can't be viewed after creation**
- ⚠️ **Rotate your credentials regularly**
- ⚠️ **Use different credentials for production vs development**

---

**Need Help?** Check the [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
