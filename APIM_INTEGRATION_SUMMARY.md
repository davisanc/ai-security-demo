# Azure API Management Integration Summary

## What Changed

The deployment pipeline now includes **Azure API Management (APIM)** as a secure gateway layer protecting your Container Apps.

## New Architecture Flow

**Before (Direct Access):**
```
User → Container App → Azure OpenAI
```

**After (with APIM):**
```
User → API Management → Container App → Azure OpenAI
       ↓
   - Rate Limiting (100/min per IP)
   - Subscription Keys
   - Security Headers
   - CORS Protection
   - Analytics & Monitoring
```

## Files Modified

### 1. `.github/workflows/deploy-containerapp.yml`
- **Added**: `APIM_NAME`, `APIM_PUBLISHER_EMAIL`, `APIM_PUBLISHER_NAME` environment variables
- **New Job**: `deploy-apim` - Creates and configures APIM instance
- **Updated Job**: `configure-services` - Now includes APIM in the workflow
- **Enhanced**: Deployment summary now shows APIM URL and subscription key

### 2. New Files Created

#### `APIM_SETUP.md`
Comprehensive guide covering:
- Architecture overview
- Security benefits
- How to access the application (via APIM vs direct)
- Rate limiting configuration
- Subscription key management
- Monitoring and analytics
- Advanced policies (IP whitelisting, JWT validation, caching)
- Cost management
- Troubleshooting guide
- Production checklist

#### `README.md` (Updated)
- Added Azure Deployment with API Management section
- Architecture diagram
- Security features list
- Link to APIM_SETUP.md

## Key Features Enabled

### Security
✅ **Rate Limiting**: 100 calls per minute per IP address
✅ **Subscription Keys**: Optional authentication (created automatically)
✅ **CORS Protection**: Configurable cross-origin policies
✅ **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options
✅ **Request Tracking**: All requests logged with IP and timestamp

### Monitoring
✅ **Built-in Analytics**: Request count, response times, error rates
✅ **Geographic Insights**: See where requests come from
✅ **Usage Metrics**: Track API consumption patterns
✅ **Performance Monitoring**: Response time distribution

### Management
✅ **Centralized Gateway**: Single entry point for all traffic
✅ **Policy Enforcement**: Rate limits, transformations, validation
✅ **Version Control**: Easy API versioning
✅ **Multiple Backends**: Can route to different services

## APIM Configuration Details

### Tier: Basic (MCP Server Support)

**Why Basic tier?** Developer and Consumption tiers do NOT support MCP servers yet.

- **Fixed cost**: ~$150-200/month
- **Capacity**: 1 unit (configurable)
- **SLA**: 99.95% uptime guarantee
- **Features**:
  - ✅ **MCP Server Integration** (AI Gateway)
  - ✅ Up to 10M API calls/month included
  - ✅ Production-ready with SLA
  - ✅ Managed identity support
  - ✅ Custom domains

### Upgrade Path

| If you need... | Upgrade to... | Cost |
|---------------|---------------|------|
| Higher traffic (>10M calls/month) | Standard | ~$700/month |
| Multi-region deployment | Premium | ~$2,800+/month |
| Just testing (no MCP needed yet) | Developer | ~$50/month |

> **Note**: To change tiers, update `APIM_SKU_NAME` and `APIM_SKU_CAPACITY` in the workflow file.

### Policies Applied

```xml
<policies>
  <inbound>
    <!-- Rate limiting: 100 calls/min per IP -->
    <rate-limit-by-key calls="100" renewal-period="60" 
                       counter-key="@(context.Request.IpAddress)" />
    
    <!-- CORS for web clients -->
    <cors allow-credentials="true">
      <allowed-origins><origin>*</origin></allowed-origins>
      <allowed-methods>
        <method>GET</method>
        <method>POST</method>
        <method>PUT</method>
        <method>DELETE</method>
        <method>OPTIONS</method>
      </allowed-methods>
    </cors>
    
    <!-- Security headers -->
    <set-header name="X-Forwarded-For">
      <value>@(context.Request.IpAddress)</value>
    </set-header>
  </inbound>
  
  <outbound>
    <!-- Response security headers -->
    <set-header name="X-Content-Type-Options">
      <value>nosniff</value>
    </set-header>
    <set-header name="X-Frame-Options">
      <value>DENY</value>
    </set-header>
    <set-header name="Strict-Transport-Security">
      <value>max-age=31536000; includeSubDomains</value>
    </set-header>
  </outbound>
</policies>
```

## Deployment Process

### First Deployment (with APIM)
1. **Push to GitHub** → Triggers workflow
2. **Deploy MCP Server** (~5 minutes)
3. **Deploy Web App** (~5 minutes)
4. **Create APIM Instance** (~30-45 minutes for Basic tier)
   - Creates API Management service
   - Configures API for Web App
   - Applies rate limiting policies
   - Creates subscription key
5. **Configure Services** (~1 minute)
   - Updates CORS settings
   - Tests all endpoints
   - Displays URLs and keys

**Total Time**: ~45-60 minutes for first deployment with Basic tier

### Subsequent Deployments
- **APIM exists**: Updates existing instance (~2-3 minutes)
- **Total Time**: ~15-20 minutes

## URLs After Deployment

You'll get three URLs in the deployment output:

### 1. APIM Gateway URL (Production)
```
https://ai-security-apim.azure-api.net/
```
- **Use this for**: Production traffic
- **Benefits**: Rate limiting, monitoring, security
- **Authentication**: Optional subscription key

### 2. Web App URL (Direct)
```
https://ai-security-web.jollyocean-4c140d70.eastus.azurecontainerapps.io/
```
- **Use this for**: Development, debugging
- **Benefits**: Direct access, bypasses APIM
- **Note**: Not rate-limited

### 3. MCP Server URL (Backend)
```
https://mcp-server.jollyocean-4c140d70.eastus.azurecontainerapps.io/
```
- **Use this for**: Internal communication
- **Note**: Can be restricted to APIM traffic only

## How to Use

### For Development
```bash
# Use direct Container App URL
curl https://ai-security-web.jollyocean-4c140d70.eastus.azurecontainerapps.io/
```

### For Production (Recommended)
```bash
# Use APIM Gateway
curl https://ai-security-apim.azure-api.net/

# With subscription key (more secure)
curl https://ai-security-apim.azure-api.net/ \
  -H "Ocp-Apim-Subscription-Key: <your-key>"
```

### In Browser/React App
Update your API base URL to use APIM:

```typescript
// Before
const API_URL = 'https://ai-security-web.jollyocean-4c140d70.eastus.azurecontainerapps.io'

// After (Production)
const API_URL = 'https://ai-security-apim.azure-api.net'
const SUBSCRIPTION_KEY = process.env.APIM_SUBSCRIPTION_KEY

fetch(API_URL, {
  headers: {
    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
  }
})
```

## Monitoring Your API

### View Analytics
1. Azure Portal → API Management → `ai-security-apim`
2. Click **Analytics** to see:
   - Request count by time
   - Response time distribution
   - Error rates
   - Top operations
   - Geographic distribution

### Check Rate Limits
```bash
# See who's hitting rate limits
az apim api operation list \
  --resource-group ai-security-rg \
  --service-name ai-security-apim \
  --api-id web-app-api
```

### View Logs
APIM logs include:
- Request timestamp
- Source IP address
- Request path and method
- Response status code
- Response time
- Subscription ID (if used)

## Cost Estimates

### APIM Basic Tier
- **Fixed monthly cost**: ~$150-200/month
- **Included**: Up to 10M API calls/month
- **SLA**: 99.95% uptime guarantee
- **MCP Support**: ✅ Enabled

> **Note**: Basic tier has a fixed monthly cost, but includes production SLA and MCP server support. For development/testing without MCP needs, consider Developer tier (~$50/month).

### Container Apps (Unchanged)
- **Web App**: ~$15-30/month (with scale-to-zero)
- **MCP Server**: ~$20-40/month (min 1 replica)

### Total Estimated Cost
- **Production (with APIM Basic)**: ~$185-270/month
- **Development (with APIM Developer)**: ~$85-120/month
- **Benefits**: MCP server integration, production SLA, enterprise security

## Security Best Practices

### 1. Use Subscription Keys in Production
```bash
# Get your subscription key
az apim subscription show \
  --resource-group ai-security-rg \
  --service-name ai-security-apim \
  --sid web-app-subscription \
  --query primaryKey -o tsv
```

### 2. Restrict CORS Origins
Edit the APIM policy to allow only your domains:
```xml
<allowed-origins>
  <origin>https://yourdomain.com</origin>
</allowed-origins>
```

### 3. Implement IP Whitelisting (Optional)
```xml
<ip-filter action="allow">
  <address>1.2.3.4</address>
</ip-filter>
```

### 4. Enable Application Insights
For detailed logging and tracing:
```bash
az apim logger create \
  --resource-group ai-security-rg \
  --service-name ai-security-apim \
  --logger-type applicationInsights
```

### 5. Rotate Subscription Keys Regularly
```bash
# Regenerate primary key
az apim subscription regenerate-key \
  --resource-group ai-security-rg \
  --service-name ai-security-apim \
  --sid web-app-subscription \
  --key-type primary
```

## Troubleshooting

### Issue: APIM Creation Taking Too Long
- **Expected**: 30-45 minutes for Basic tier (first deployment)
- **Check**: GitHub Actions logs for progress
- **Solution**: Wait for completion, APIM provisioning takes time
- **Note**: Subsequent updates are much faster (~2-3 minutes)

### Issue: 429 Rate Limit Errors
- **Cause**: Exceeded 100 calls/min per IP
- **Solution**: Wait 60 seconds or adjust rate limit
- **Check**: Who's making the requests in Analytics

### Issue: Can't Access via APIM
- **Check 1**: Is APIM deployment complete?
- **Check 2**: Are you using the correct URL?
- **Check 3**: Is subscription key required and provided?

## Next Steps

1. **Test the deployment**:
   ```bash
   git add .
   git commit -m "Add Azure API Management to deployment"
   git push origin main
   ```

2. **Monitor the deployment** in GitHub Actions

3. **Get your APIM URL** from deployment output

4. **Test the gateway**:
   ```bash
   curl https://<apim-name>.azure-api.net/
   ```

5. **Review analytics** in Azure Portal

6. **Configure custom domain** (optional)

7. **Set up alerts** for rate limits and errors

## Additional Resources

- [APIM_SETUP.md](./APIM_SETUP.md) - Detailed configuration guide
- [Azure APIM Docs](https://learn.microsoft.com/en-us/azure/api-management/)
- [APIM Policies](https://learn.microsoft.com/en-us/azure/api-management/api-management-policies)
- [APIM Best Practices](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region)

---

**Ready to deploy?** Just push to `main` branch and the workflow will handle everything! 🚀
