# Azure Deployment Guide - Static Web App + MCP Server

This guide walks you through deploying the AI Security Demo application to Azure Static Web Apps and integrating with a Model Context Protocol (MCP) server for AI inference, security, and compliance.

## Architecture Overview

```
┌─────────────────────┐
│   Azure Static      │
│   Web Apps          │
│   (React Frontend)  │
└──────────┬──────────┘
           │
           │ HTTPS
           ↓
┌─────────────────────┐
│   MCP Server        │
│   (Azure Container  │
│    Apps / App       │
│    Service)         │
└──────────┬──────────┘
           │
           │ Secure Connection
           ↓
┌─────────────────────┐
│   Azure OpenAI      │
│   Service           │
└─────────────────────┘
```

## Prerequisites

- Azure subscription ([free trial available](https://azure.microsoft.com/free/))
- GitHub account
- Azure CLI installed ([download here](https://aka.ms/installazurecli))
- Node.js 18+ installed
- Git installed
- VS Code with Azure extensions (recommended)

## Part 1: Prepare Your Application

### Step 1: Update Your Code for Production

1. **Update environment variable handling**

   Currently, your app uses client-side environment variables. For production with MCP server, update `src/lib/api.ts`:

   ```typescript
   // Instead of calling Azure OpenAI directly, call your MCP server
   const MCP_SERVER_ENDPOINT = import.meta.env.VITE_MCP_SERVER_ENDPOINT || 'http://localhost:8080'
   ```

2. **Create a production configuration file**

   Create `src/lib/mcp-client.ts`:

   ```typescript
   // MCP Client for server communication
   export interface MCPRequest {
     messages: Array<{ role: string; content: string }>
     temperature?: number
     maxTokens?: number
     enableContentSafety?: boolean
     enableThreatDetection?: boolean
   }

   export interface MCPResponse {
     content: string
     safetyAnalysis?: {
       isSafe: boolean
       categories: string[]
       severity: string
     }
     threatDetection?: {
       detected: boolean
       threats: string[]
       confidence: number
     }
   }

   export async function callMCPServer(request: MCPRequest): Promise<MCPResponse> {
     const endpoint = import.meta.env.VITE_MCP_SERVER_ENDPOINT
     
     if (!endpoint) {
       throw new Error('MCP Server endpoint not configured')
     }

     const response = await fetch(`${endpoint}/api/chat`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${import.meta.env.VITE_MCP_API_KEY || ''}`
       },
       body: JSON.stringify(request)
     })

     if (!response.ok) {
       throw new Error(`MCP Server error: ${response.statusText}`)
     }

     return await response.json()
   }

   export function isMCPConfigured(): boolean {
     return Boolean(import.meta.env.VITE_MCP_SERVER_ENDPOINT)
   }
   ```

3. **Update your existing routes to use MCP client**

   Modify `src/lib/chat-server.ts` to use the MCP client instead of direct Azure OpenAI calls.

### Step 2: Add Build Configuration

1. **Update `package.json` scripts**:

   ```json
   {
     "scripts": {
       "dev": "vite dev --port 3000",
       "build": "vite build",
       "preview": "vite preview",
       "deploy:build": "npm run build && npm run test"
     }
   }
   ```

2. **Create `staticwebapp.config.json`** in the root directory:

   ```json
   {
     "navigationFallback": {
       "rewrite": "/index.html",
       "exclude": ["/images/*.{png,jpg,gif}", "/css/*"]
     },
     "routes": [
       {
         "route": "/api/*",
         "allowedRoles": ["anonymous"]
       }
     ],
     "responseOverrides": {
       "404": {
         "rewrite": "/index.html",
         "statusCode": 200
       }
     },
     "globalHeaders": {
       "content-security-policy": "default-src 'self' https://your-mcp-server.azurecontainerapps.io; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'"
     },
     "mimeTypes": {
       ".json": "application/json",
       ".js": "text/javascript",
       ".css": "text/css"
     }
   }
   ```

### Step 3: Push to GitHub

1. **Initialize Git repository** (if not already done):

   ```bash
   git init
   git add .
   git commit -m "Prepare for Azure deployment"
   ```

2. **Create a GitHub repository**:

   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `ai-security-demo`
   - Don't initialize with README (you already have one)

3. **Push your code**:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ai-security-demo.git
   git branch -M main
   git push -u origin main
   ```

## Part 2: Deploy MCP Server

### Option A: Using Azure Container Apps (Recommended)

#### Step 1: Create MCP Server Application

1. **Create a new directory for your MCP server**:

   ```bash
   mkdir mcp-server
   cd mcp-server
   npm init -y
   ```

2. **Install dependencies**:

   ```bash
   npm install express @azure/openai dotenv cors body-parser
   npm install --save-dev @types/express @types/cors typescript ts-node
   ```

3. **Create `server.ts`**:

   ```typescript
   import express from 'express'
   import cors from 'cors'
   import { AzureOpenAI } from 'openai'
   import dotenv from 'dotenv'

   dotenv.config()

   const app = express()
   const PORT = process.env.PORT || 8080

   // Enable CORS for your Static Web App
   app.use(cors({
     origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
     credentials: true
   }))

   app.use(express.json())

   // Initialize Azure OpenAI client
   const openai = new AzureOpenAI({
     endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
     apiKey: process.env.AZURE_OPENAI_API_KEY!,
     deployment: process.env.AZURE_OPENAI_DEPLOYMENT!,
     apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-04-01-preview'
   })

   // Health check endpoint
   app.get('/health', (req, res) => {
     res.json({ status: 'healthy', timestamp: new Date().toISOString() })
   })

   // Content Safety Analysis (simulated - integrate with Azure Content Safety in production)
   function analyzeContentSafety(content: string) {
     const lowerContent = content.toLowerCase()
     const risks = []
     
     if (lowerContent.includes('hack') || lowerContent.includes('exploit')) {
       risks.push('Security Threat')
     }
     if (lowerContent.includes('bypass') || lowerContent.includes('ignore')) {
       risks.push('Prompt Injection')
     }
     
     return {
       isSafe: risks.length === 0,
       categories: risks,
       severity: risks.length > 0 ? 'HIGH' : 'NONE'
     }
   }

   // Threat Detection
   function detectThreats(content: string) {
     const lowerContent = content.toLowerCase()
     const threats = []
     
     const threatPatterns = [
       { pattern: /ignore (previous|all) (instructions|prompts)/i, threat: 'Prompt Injection Attempt' },
       { pattern: /jailbreak/i, threat: 'Jailbreak Attempt' },
       { pattern: /system prompt/i, threat: 'System Prompt Extraction' },
     ]
     
     threatPatterns.forEach(({ pattern, threat }) => {
       if (pattern.test(content)) {
         threats.push(threat)
       }
     })
     
     return {
       detected: threats.length > 0,
       threats,
       confidence: threats.length > 0 ? 0.85 : 0.0
     }
   }

   // Main chat endpoint
   app.post('/api/chat', async (req, res) => {
     try {
       const { messages, temperature = 0.7, maxTokens = 500, enableContentSafety = true, enableThreatDetection = true } = req.body

       if (!messages || !Array.isArray(messages)) {
         return res.status(400).json({ error: 'Invalid request: messages array required' })
       }

       // Get the last user message
       const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || ''

       // Perform security checks
       let safetyAnalysis = null
       let threatDetection = null

       if (enableContentSafety) {
         safetyAnalysis = analyzeContentSafety(lastUserMessage)
         
         if (!safetyAnalysis.isSafe) {
           return res.status(400).json({
             error: 'Content safety violation',
             safetyAnalysis
           })
         }
       }

       if (enableThreatDetection) {
         threatDetection = detectThreats(lastUserMessage)
         
         if (threatDetection.detected) {
           return res.json({
             content: `🚨 **Threat Detected**: ${threatDetection.threats.join(', ')}\n\nThis request has been flagged as a potential security threat and blocked by Microsoft Defender for AI.`,
             safetyAnalysis,
             threatDetection
           })
         }
       }

       // Call Azure OpenAI
       const completion = await openai.chat.completions.create({
         model: process.env.AZURE_OPENAI_DEPLOYMENT!,
         messages: messages,
         temperature,
         max_tokens: maxTokens
       })

       const content = completion.choices[0]?.message?.content || 'No response generated'

       res.json({
         content,
         safetyAnalysis,
         threatDetection,
         usage: completion.usage
       })

     } catch (error) {
       console.error('Error calling Azure OpenAI:', error)
       res.status(500).json({ 
         error: 'Internal server error',
         message: error instanceof Error ? error.message : 'Unknown error'
       })
     }
   })

   app.listen(PORT, () => {
     console.log(`MCP Server running on port ${PORT}`)
   })
   ```

4. **Create `Dockerfile`**:

   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .

   RUN npm run build

   EXPOSE 8080

   CMD ["node", "dist/server.js"]
   ```

5. **Create `tsconfig.json`**:

   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "commonjs",
       "lib": ["ES2020"],
       "outDir": "./dist",
       "rootDir": "./",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "resolveJsonModule": true
     },
     "include": ["**/*.ts"],
     "exclude": ["node_modules"]
   }
   ```

6. **Update `package.json`**:

   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/server.js",
       "dev": "ts-node server.ts"
     }
   }
   ```

#### Step 2: Deploy MCP Server to Azure Container Apps

1. **Login to Azure**:

   ```bash
   az login
   ```

2. **Create a resource group**:

   ```bash
   az group create --name ai-security-rg --location eastus
   ```

3. **Create Azure Container Registry (ACR)**:

   ```bash
   az acr create --resource-group ai-security-rg --name aisecurityacr --sku Basic
   az acr login --name aisecurityacr
   ```

4. **Build and push Docker image**:

   ```bash
   cd mcp-server
   docker build -t aisecurityacr.azurecr.io/mcp-server:latest .
   docker push aisecurityacr.azurecr.io/mcp-server:latest
   ```

5. **Create Container Apps environment**:

   ```bash
   az containerapp env create \
     --name ai-security-env \
     --resource-group ai-security-rg \
     --location eastus
   ```

6. **Deploy the MCP server**:

   ```bash
   az containerapp create \
     --name mcp-server \
     --resource-group ai-security-rg \
     --environment ai-security-env \
     --image aisecurityacr.azurecr.io/mcp-server:latest \
     --target-port 8080 \
     --ingress external \
     --registry-server aisecurityacr.azurecr.io \
     --secrets \
       azure-openai-endpoint=YOUR_AZURE_OPENAI_ENDPOINT \
       azure-openai-key=YOUR_AZURE_OPENAI_KEY \
     --env-vars \
       AZURE_OPENAI_ENDPOINT=secretref:azure-openai-endpoint \
       AZURE_OPENAI_API_KEY=secretref:azure-openai-key \
       AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini \
       AZURE_OPENAI_API_VERSION=2024-04-01-preview \
       PORT=8080 \
       ALLOWED_ORIGINS=https://YOUR-STATIC-WEB-APP.azurestaticapps.net
   ```

7. **Get your MCP server URL**:

   ```bash
   az containerapp show \
     --name mcp-server \
     --resource-group ai-security-rg \
     --query properties.configuration.ingress.fqdn -o tsv
   ```

   Save this URL - you'll need it for your Static Web App configuration.

### Option B: Using Azure App Service

If you prefer App Service over Container Apps:

1. **Create App Service**:

   ```bash
   az appservice plan create \
     --name ai-security-plan \
     --resource-group ai-security-rg \
     --sku B1 \
     --is-linux

   az webapp create \
     --resource-group ai-security-rg \
     --plan ai-security-plan \
     --name mcp-server-unique-name \
     --runtime "NODE|18-lts"
   ```

2. **Configure environment variables**:

   ```bash
   az webapp config appsettings set \
     --resource-group ai-security-rg \
     --name mcp-server-unique-name \
     --settings \
       AZURE_OPENAI_ENDPOINT=YOUR_ENDPOINT \
       AZURE_OPENAI_API_KEY=YOUR_KEY \
       AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini \
       AZURE_OPENAI_API_VERSION=2024-04-01-preview
   ```

3. **Deploy from GitHub** or use ZIP deploy:

   ```bash
   cd mcp-server
   npm run build
   zip -r deploy.zip .
   az webapp deployment source config-zip \
     --resource-group ai-security-rg \
     --name mcp-server-unique-name \
     --src deploy.zip
   ```

## Part 3: Deploy Static Web App

### Step 1: Create Static Web App via Azure Portal

1. **Go to Azure Portal**: [portal.azure.com](https://portal.azure.com)

2. **Create a new Static Web App**:
   - Click "Create a resource"
   - Search for "Static Web Apps"
   - Click "Create"

3. **Configure Basic Settings**:
   - **Subscription**: Select your subscription
   - **Resource Group**: Use `ai-security-rg` or create new
   - **Name**: `ai-security-demo` (or your preferred name)
   - **Plan type**: Free (for development) or Standard (for production)
   - **Region**: Choose closest to your users
   - **Source**: GitHub

4. **Authenticate with GitHub**:
   - Click "Sign in with GitHub"
   - Authorize Azure Static Web Apps

5. **Configure Build Details**:
   - **Organization**: Your GitHub username
   - **Repository**: `ai-security-demo`
   - **Branch**: `main`
   - **Build Presets**: `React`
   - **App location**: `/` (root)
   - **Api location**: Leave empty (we're using MCP server)
   - **Output location**: `dist`

6. **Review + Create**:
   - Review your settings
   - Click "Create"

### Step 2: Configure Environment Variables

1. **In Azure Portal, go to your Static Web App**

2. **Navigate to Configuration** (in the left menu)

3. **Add Application Settings**:
   - Click "+ Add"
   - Add the following variables:
     ```
     VITE_MCP_SERVER_ENDPOINT=https://your-mcp-server.azurecontainerapps.io
     VITE_MCP_API_KEY=your-optional-api-key
     ```

4. **Save** the configuration

### Step 3: Update GitHub Workflow

After creation, Azure creates a GitHub Actions workflow. Update it if needed:

1. **Go to your GitHub repository**

2. **Navigate to** `.github/workflows/azure-static-web-apps-*.yml`

3. **Ensure it looks like this**:

   ```yaml
   name: Azure Static Web Apps CI/CD

   on:
     push:
       branches:
         - main
     pull_request:
       types: [opened, synchronize, reopened, closed]
       branches:
         - main

   jobs:
     build_and_deploy_job:
       if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
       runs-on: ubuntu-latest
       name: Build and Deploy Job
       steps:
         - uses: actions/checkout@v3
           with:
             submodules: true
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build
           run: npm run build
           env:
             VITE_MCP_SERVER_ENDPOINT: ${{ secrets.VITE_MCP_SERVER_ENDPOINT }}
             VITE_MCP_API_KEY: ${{ secrets.VITE_MCP_API_KEY }}
         
         - name: Deploy to Azure Static Web Apps
           uses: Azure/static-web-apps-deploy@v1
           with:
             azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
             repo_token: ${{ secrets.GITHUB_TOKEN }}
             action: "upload"
             app_location: "/"
             output_location: "dist"

     close_pull_request_job:
       if: github.event_name == 'pull_request' && github.event.action == 'closed'
       runs-on: ubuntu-latest
       name: Close Pull Request Job
       steps:
         - name: Close Pull Request
           uses: Azure/static-web-apps-deploy@v1
           with:
             azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
             action: "close"
   ```

4. **Add GitHub Secrets**:
   - Go to your GitHub repository settings
   - Navigate to "Secrets and variables" > "Actions"
   - Add secrets:
     - `VITE_MCP_SERVER_ENDPOINT`: Your MCP server URL
     - `VITE_MCP_API_KEY`: Your optional API key

### Step 4: Deploy

1. **Push any change to trigger deployment**:

   ```bash
   git add .
   git commit -m "Configure for Azure deployment"
   git push origin main
   ```

2. **Monitor deployment**:
   - Go to the "Actions" tab in your GitHub repository
   - Watch the deployment progress

3. **Access your app**:
   - Once deployed, go to Azure Portal
   - Find your Static Web App
   - Click the URL to access your deployed app

## Part 4: Configure CORS and Security

### Step 1: Update MCP Server CORS Settings

Update your MCP server to allow requests from your Static Web App:

```bash
az containerapp update \
  --name mcp-server \
  --resource-group ai-security-rg \
  --set-env-vars ALLOWED_ORIGINS=https://your-static-web-app.azurestaticapps.net,https://www.your-custom-domain.com
```

### Step 2: Configure Custom Domain (Optional)

1. **In Azure Portal, go to your Static Web App**

2. **Navigate to Custom domains**

3. **Add custom domain**:
   - Enter your domain name
   - Follow DNS configuration instructions

### Step 3: Enable Authentication (Optional)

1. **In Azure Portal, go to your Static Web App**

2. **Navigate to Authentication**

3. **Configure authentication provider** (Azure AD, GitHub, etc.)

## Part 5: Monitoring and Scaling

### Step 1: Enable Application Insights

1. **Create Application Insights**:

   ```bash
   az monitor app-insights component create \
     --app ai-security-insights \
     --location eastus \
     --resource-group ai-security-rg
   ```

2. **Get instrumentation key**:

   ```bash
   az monitor app-insights component show \
     --app ai-security-insights \
     --resource-group ai-security-rg \
     --query instrumentationKey -o tsv
   ```

3. **Add to your MCP server**:

   ```bash
   npm install applicationinsights
   ```

   Update your `server.ts`:

   ```typescript
   import * as appInsights from 'applicationinsights'
   
   appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
     .setAutoCollectRequests(true)
     .setAutoCollectPerformance(true)
     .setAutoCollectExceptions(true)
     .start()
   ```

### Step 2: Configure Scaling (Container Apps)

```bash
az containerapp update \
  --name mcp-server \
  --resource-group ai-security-rg \
  --min-replicas 1 \
  --max-replicas 10 \
  --scale-rule-name http-scale \
  --scale-rule-type http \
  --scale-rule-metadata concurrentRequests=10
```

## Testing Your Deployment

### Test 1: Health Check

```bash
curl https://your-mcp-server.azurecontainerapps.io/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-15T..."
}
```

### Test 2: Chat Endpoint

```bash
curl -X POST https://your-mcp-server.azurecontainerapps.io/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello, test message"}
    ],
    "enableContentSafety": true,
    "enableThreatDetection": true
  }'
```

### Test 3: Static Web App

1. Open your Static Web App URL in a browser
2. Navigate to different sections
3. Test the chat functionality
4. Verify threat detection works

## Troubleshooting

### Static Web App not building

- Check GitHub Actions logs
- Verify `package.json` scripts
- Ensure `vite.config.ts` is correct
- Check environment variables

### MCP Server not responding

- Check Container App logs:
  ```bash
  az containerapp logs show \
    --name mcp-server \
    --resource-group ai-security-rg \
    --follow
  ```
- Verify environment variables
- Check Azure OpenAI credentials
- Test health endpoint

### CORS errors

- Update `ALLOWED_ORIGINS` in MCP server
- Verify Static Web App URL is correct
- Check browser console for exact error

### Authentication issues

- Verify Azure OpenAI credentials
- Check API key in Azure Portal
- Ensure deployment name is correct

## Cost Optimization

- **Static Web Apps Free Tier**: 100 GB bandwidth/month free
- **Container Apps**: ~$30-50/month for basic usage
- **Azure OpenAI**: Pay per token usage
- **Application Insights**: First 5 GB/month free

**Estimated monthly cost**: $50-100 depending on usage

## Security Best Practices

1. ✅ Use Azure Key Vault for secrets (not environment variables)
2. ✅ Enable Azure AD authentication
3. ✅ Implement rate limiting on MCP server
4. ✅ Use managed identities instead of connection strings
5. ✅ Enable Azure DDoS Protection
6. ✅ Set up alerts for unusual activity
7. ✅ Regularly rotate API keys
8. ✅ Use Azure Front Door for CDN and WAF

## Next Steps

1. Set up CI/CD pipeline for MCP server
2. Implement Azure Content Safety service integration
3. Add Azure Monitor dashboards
4. Configure backup and disaster recovery
5. Implement comprehensive logging
6. Set up staging environments

## Resources

- [Azure Static Web Apps Documentation](https://learn.microsoft.com/azure/static-web-apps/)
- [Azure Container Apps Documentation](https://learn.microsoft.com/azure/container-apps/)
- [Azure OpenAI Documentation](https://learn.microsoft.com/azure/ai-services/openai/)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [GitHub Actions Documentation](https://docs.github.com/actions)

## Support

For issues or questions:
- Check Azure Portal diagnostics
- Review GitHub Actions logs
- Check Container Apps logs
- Review Application Insights telemetry

---

**Last Updated**: October 15, 2025
