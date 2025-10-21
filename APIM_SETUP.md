# Azure API Management (APIM) Setup Guide

## Overview

Your AI Security Demo is now protected by **Azure API Management (APIM)**, which acts as a secure gateway between your users and the backend Container Apps.

**Important**: This deployment uses the **Basic tier** to support **MCP (Model Context Protocol) servers** integration with Azure AI Foundry. Developer and Consumption tiers do not yet support MCP servers.

## Architecture

```
User/Browser
    ↓
[Azure API Management - Basic Tier]  ← Main Entry Point (Recommended)
    ↓
  Features:
  - Rate Limiting (100 calls/min per IP)
  - CORS Protection
  - Security Headers
  - Request/Response Transformation
  - 🔌 MCP Server Support (AI Gateway)
    ↓
[AI Security Web App Container]
    ↓
[Azure OpenAI / AI Foundry LLM]
    ↓
[MCP Servers] ← Can be integrated via APIM
```

## MCP Server Support

### What are MCP Servers?

**Model Context Protocol (MCP)** servers allow AI models to interact with external tools, databases, and APIs in a standardized way. APIM's AI Gateway feature enables seamless integration.

### Current Status

| APIM Tier | MCP Server Support | Status |
|-----------|-------------------|--------|
| Consumption | ❌ | Coming soon |
| Developer | ❌ | Coming soon |
| **Basic** | ✅ | **Supported** (current deployment) |
| Standard | ✅ | Supported |
| Premium | ✅ | Supported |

### Why Basic Tier?

This deployment uses the **Basic tier** specifically to:
1. ✅ **Enable MCP server integration** with Azure AI Foundry
2. ✅ Provide production-ready SLA (99.95% uptime)
3. ✅ Support future AI Gateway features
4. ✅ Allow upgrade path to Standard/Premium without migration

### Future MCP Integration

Once you're ready to integrate MCP servers:

```bash
# Example: Register MCP server in APIM
az apim api create \
  --resource-group ai-security-rg \
  --service-name ai-security-apim \
  --api-id mcp-api \
  --display-name "MCP Server API" \
  --service-url "https://your-mcp-server.com" \
  --path "/mcp"
```

Learn more: [Azure APIM AI Gateway Documentation](https://learn.microsoft.com/en-us/azure/api-management/ai-gateway-overview)

## Why APIM?

### Security Benefits
- **Rate Limiting**: Prevents abuse with 100 calls per minute per IP address
- **Subscription Keys**: Optional authentication layer for controlled access
- **IP Filtering**: Can restrict access to specific IP ranges (not enabled by default)
- **Security Headers**: Automatically adds HSTS, X-Frame-Options, etc.
- **CORS Protection**: Controlled cross-origin resource sharing

### Monitoring & Analytics
- **Request Tracking**: Every API call is logged and tracked
- **Performance Metrics**: Response times, error rates, throughput
- **Usage Analytics**: Understand who's using your API and how
- **Cost Tracking**: Monitor consumption patterns

### Management Features
- **Versioning**: Easy API versioning without changing backend
- **Caching**: Built-in response caching for performance
- **Transformation**: Modify requests/responses on the fly
- **Multiple Backends**: Route to different services based on path/headers

## Accessing Your Application

### Option 1: Via APIM (Recommended for Production)

**Public Access:**
```bash
# Your APIM Gateway URL (shown in deployment output)
https://<apim-name>.azure-api.net/

# Example request
curl https://<apim-name>.azure-api.net/
```

**With Subscription Key (More Secure):**
```bash
# Add subscription key to requests
curl https://<apim-name>.azure-api.net/ \
  -H "Ocp-Apim-Subscription-Key: <your-subscription-key>"
```

### Option 2: Direct to Container Apps (For Development/Debugging)

```bash
# Direct access bypassing APIM (not rate-limited)
https://<web-app-name>.jollyocean-4c140d70.eastus.azurecontainerapps.io/
```

## APIM Configuration Details

### Rate Limiting Policy

Currently set to **100 calls per minute per IP address**. Adjust in the workflow:

```xml
<rate-limit-by-key calls="100" renewal-period="60" counter-key="@(context.Request.IpAddress)" />
```

To change:
1. Edit `.github/workflows/deploy-containerapp.yml`
2. Find the `Apply Rate Limiting Policy` step
3. Modify the `calls` and `renewal-period` values
4. Commit and push to redeploy

### Security Headers

Automatically applied to all responses:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### CORS Configuration

Currently allows all origins (`*`). To restrict:

```xml
<cors allow-credentials="true">
  <allowed-origins>
    <origin>https://yourdomain.com</origin>
    <origin>https://app.yourdomain.com</origin>
  </allowed-origins>
  <!-- ... -->
</cors>
```

## Subscription Keys

### Getting Your Subscription Key

The subscription key is output at the end of deployment. You can also retrieve it:

```bash
az apim subscription show \
  --resource-group ai-security-rg \
  --service-name ai-security-apim \
  --sid web-app-subscription \
  --query primaryKey -o tsv
```

### Using Subscription Keys

**Option 1: Header (Recommended)**
```bash
curl https://<apim-name>.azure-api.net/ \
  -H "Ocp-Apim-Subscription-Key: your-key-here"
```

**Option 2: Query Parameter**
```bash
curl "https://<apim-name>.azure-api.net/?subscription-key=your-key-here"
```

### Rotating Subscription Keys

```bash
# Regenerate primary key
az apim subscription regenerate-key \
  --resource-group ai-security-rg \
  --service-name ai-security-apim \
  --sid web-app-subscription \
  --key-type primary

# Regenerate secondary key
az apim subscription regenerate-key \
  --resource-group ai-security-rg \
  --service-name ai-security-apim \
  --sid web-app-subscription \
  --key-type secondary
```

## Monitoring & Analytics

### View API Analytics

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Resource Groups** → `ai-security-rg`
3. Select **API Management** → `ai-security-apim`
4. Click **Analytics** to see:
   - Request count
   - Response times
   - Error rates
   - Geographic distribution
   - Top operations

### View Logs

```bash
# Enable Application Insights (optional)
az apim logger create \
  --resource-group ai-security-rg \
  --service-name ai-security-apim \
  --logger-id appinsights \
  --logger-type applicationInsights \
  --credentials instrumentationKey=<your-instrumentation-key>
```

### Set Up Alerts

Create alerts for:
- High error rates (>5% of requests)
- Rate limit violations
- Slow response times (>2 seconds)
- Unusual traffic patterns

## Advanced Policies

### IP Whitelisting

Restrict access to specific IP addresses:

```xml
<inbound>
  <ip-filter action="allow">
    <address>1.2.3.4</address>
    <address-range from="5.6.7.8" to="5.6.7.15" />
  </ip-filter>
  <!-- ... existing policies ... -->
</inbound>
```

### Request/Response Transformation

Modify requests before they reach the backend:

```xml
<inbound>
  <!-- Add custom header to all requests -->
  <set-header name="X-Custom-Header" exists-action="override">
    <value>CustomValue</value>
  </set-header>
  
  <!-- Transform JSON request body -->
  <set-body template="liquid">
    {
      "timestamp": "{{context.Timestamp}}",
      "originalRequest": {{body}}
    }
  </set-body>
</inbound>
```

### Caching

Enable response caching for GET requests:

```xml
<inbound>
  <!-- Cache for 60 seconds -->
  <cache-lookup vary-by-developer="false" vary-by-developer-groups="false">
    <vary-by-header>Accept</vary-by-header>
    <vary-by-header>Accept-Charset</vary-by-header>
  </cache-lookup>
</inbound>
<outbound>
  <cache-store duration="60" />
</outbound>
```

### JWT Validation

Add OAuth2/JWT validation:

```xml
<inbound>
  <validate-jwt header-name="Authorization" failed-validation-httpcode="401">
    <openid-config url="https://login.microsoftonline.com/{tenant}/.well-known/openid-configuration" />
    <required-claims>
      <claim name="aud" match="all">
        <value>your-app-id</value>
      </claim>
    </required-claims>
  </validate-jwt>
</inbound>
```

## Cost Management

### APIM Basic Tier Pricing

**Current Configuration**: Basic tier (supports MCP servers)

- **Fixed monthly cost**: ~$150-200/month (varies by region)
- **Capacity**: 1 unit (configurable in workflow)
- **Included features**:
  - Up to 10M API calls/month included
  - 1 gateway deployment
  - No data transfer charges within same region
  - **MCP server support** ✅

> **Why Basic tier?**: Developer and Consumption tiers do NOT support MCP servers yet. Basic is the most cost-effective tier that supports MCP integration with Azure AI Foundry.

### Tier Comparison

| Feature | Consumption | Developer | **Basic** | Standard | Premium |
|---------|------------|-----------|-----------|----------|---------|
| **Cost/month** | ~$3.50/1M calls | ~$50 | ~$150-200 | ~$700 | ~$2,800+ |
| **MCP Servers** | ❌ Coming soon | ❌ Coming soon | ✅ **Supported** | ✅ Supported | ✅ Supported |
| **SLA** | None | None | 99.95% | 99.95% | 99.99% |
| **Capacity** | Auto-scale | Dev only | 2 units max | 4 units max | Unlimited |
| **Ideal for** | Low traffic | Development | **Production (small-medium)** | Production (high traffic) | Enterprise |

### Upgrading/Downgrading Tiers

To change the APIM tier, update these variables in `.github/workflows/deploy-containerapp.yml`:

```yaml
env:
  # Options: Basic, Standard, Premium
  # Note: Developer and Consumption do NOT support MCP servers yet
  APIM_SKU_NAME: Basic
  APIM_SKU_CAPACITY: 1  # Scale units (Basic supports 1-2)

### Cost Optimization Tips

1. **Enable Caching**: Reduce backend calls
2. **Set Appropriate Rate Limits**: Prevent excessive usage
3. **Monitor Analytics**: Identify and optimize high-traffic endpoints
4. **Use Subscription Keys**: Track and control access per client
5. **Review Policies**: Remove unnecessary transformations

### View Current Costs

```bash
# View resource costs in Azure Portal
az consumption usage list \
  --start-date 2025-10-01 \
  --end-date 2025-10-31 \
  --query "[?contains(instanceName,'apim')]" \
  --output table
```

## Troubleshooting

### "Access Denied" Errors

**Issue**: Getting 401 or 403 errors

**Solutions**:
1. Check if subscription key is required and provided
2. Verify IP address is not blocked
3. Check CORS settings if calling from browser
4. Review APIM policies for authentication requirements

### Rate Limit Exceeded

**Issue**: Getting 429 Too Many Requests

**Solutions**:
1. Wait for the rate limit window to reset (60 seconds)
2. Implement client-side rate limiting
3. Increase rate limit in APIM policy (if justified)
4. Consider using multiple subscription keys for different clients

### Slow Response Times

**Issue**: Requests taking too long

**Solutions**:
1. Enable caching for GET requests
2. Check backend Container App performance
3. Review APIM policy complexity (transformations add latency)
4. Enable Application Insights for detailed tracing
5. Scale up backend Container Apps if needed

### APIM Creation Failed

**Issue**: APIM deployment takes >45 minutes or fails

**Solutions**:
1. Check Azure service health in the region
2. Verify you have sufficient quota for APIM
3. Consumption tier is fastest to provision (~10-15 minutes)
4. Check deployment logs in GitHub Actions

## Production Checklist

Before going live:

- [ ] Configure custom domain for APIM
- [ ] Enable HTTPS/TLS 1.2+ only
- [ ] Set up Application Insights logging
- [ ] Configure alerts for errors and rate limits
- [ ] Implement subscription key rotation policy
- [ ] Review and test all APIM policies
- [ ] Set appropriate rate limits based on expected load
- [ ] Enable IP whitelisting if applicable
- [ ] Configure backup and disaster recovery
- [ ] Set up cost alerts and budgets
- [ ] Document API for consumers
- [ ] Test failover scenarios

## Additional Resources

- [Azure APIM Documentation](https://learn.microsoft.com/en-us/azure/api-management/)
- [APIM Policy Reference](https://learn.microsoft.com/en-us/azure/api-management/api-management-policies)
- [APIM Best Practices](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region)
- [APIM Pricing](https://azure.microsoft.com/en-us/pricing/details/api-management/)

## Support

For issues with APIM configuration:
1. Check Azure Portal → API Management → Diagnostics
2. Review GitHub Actions logs for deployment errors
3. Enable debug logging in APIM policies
4. Contact Azure Support if needed

---

**Security Note**: Never commit subscription keys to source control. Use Azure Key Vault or GitHub Secrets for sensitive values.
