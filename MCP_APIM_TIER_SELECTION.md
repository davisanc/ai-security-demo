# APIM Tier Selection for MCP Server Support

## TL;DR

**This deployment uses Azure API Management Basic tier** because:
- ✅ **MCP servers are supported** (AI Gateway feature)
- ✅ Production-ready with 99.95% SLA
- ✅ Most cost-effective tier with MCP support (~$150-200/month)
- ❌ Developer and Consumption tiers do **NOT** support MCP servers yet

## Background

### What are MCP Servers?

**Model Context Protocol (MCP)** is a standardized protocol that allows AI models to interact with external tools, databases, and APIs. MCP servers act as intermediaries that:

1. **Provide tools** to AI models (e.g., database queries, file operations, API calls)
2. **Maintain context** across multiple AI interactions
3. **Enable secure access** to enterprise resources
4. **Standardize integration** across different AI platforms

### Azure APIM AI Gateway

Azure API Management's **AI Gateway** feature enables:
- Direct integration with Azure AI Foundry
- MCP server registration and management
- Rate limiting and token usage tracking for AI calls
- Cost attribution per AI consumer
- Security policies for AI endpoints

## Tier Comparison for MCP Support

| Tier | Monthly Cost | MCP Support | Best For |
|------|-------------|-------------|----------|
| **Consumption** | ~$3.50/1M calls | ❌ Coming soon | Low-cost APIs without AI Gateway |
| **Developer** | ~$50 | ❌ Coming soon | Development/testing without MCP |
| **Basic** ⭐ | ~$150-200 | ✅ **Supported** | **Production with MCP (recommended)** |
| **Standard** | ~$700 | ✅ Supported | High-traffic production |
| **Premium** | ~$2,800+ | ✅ Supported | Enterprise multi-region |

### Why Not Consumption or Developer?

From Microsoft documentation:

> MCP servers are currently supported in **Basic, Standard, and Premium** tiers, both classic and v2. For classic tiers your service must be enrolled in the AI Gateway Early Update group. **Support in the Developer and Consumption tiers is coming soon.**

Reference: [Azure APIM AI Gateway Overview](https://learn.microsoft.com/en-us/azure/api-management/ai-gateway-overview)

## Cost Analysis

### Scenario 1: Using Basic Tier (Current)

**Monthly Costs:**
- APIM Basic: ~$150-200
- Container Apps: ~$35-70
- **Total: ~$185-270/month**

**Benefits:**
- ✅ MCP server integration ready
- ✅ Production SLA (99.95%)
- ✅ Up to 10M API calls included
- ✅ Managed identity support
- ✅ No surprises (fixed monthly cost)

### Scenario 2: Waiting for Consumption MCP Support

**If/when Consumption tier supports MCP:**
- APIM Consumption: ~$3.50/1M calls (first 1M free)
- Container Apps: ~$35-70
- **Total: ~$35-85/month** (for <5M calls)

**Trade-offs:**
- ❌ No SLA
- ❌ No timeline for MCP support availability
- ❌ Development blocked on MCP features
- ✅ Lower cost for low traffic

### Scenario 3: Using Developer for Testing

**Monthly Costs:**
- APIM Developer: ~$50
- Container Apps: ~$35-70
- **Total: ~$85-120/month**

**Limitations:**
- ❌ No MCP support
- ❌ No production SLA
- ❌ Not for production use
- ✅ Good for development/testing without MCP

## Recommendation

### For Production with MCP Needs: Use Basic Tier ⭐

**Current deployment configuration:**
```yaml
env:
  APIM_SKU_NAME: Basic
  APIM_SKU_CAPACITY: 1
```

**Pros:**
- Immediate MCP server integration capability
- Production-ready with SLA
- Predictable monthly costs
- Easy upgrade path to Standard/Premium
- AI Gateway features available

**Cons:**
- Higher base cost than Consumption/Developer
- Overkill if you don't need MCP servers

### For Development Without MCP: Use Developer Tier

**Alternative configuration:**
```yaml
env:
  APIM_SKU_NAME: Developer
  APIM_SKU_CAPACITY: 1
```

**Use when:**
- Still in development phase
- Don't need MCP integration yet
- Want to minimize costs
- No production SLA required

**Migration path:** When ready for production with MCP, upgrade to Basic tier (no code changes needed).

## How to Change Tiers

### Option 1: Before First Deployment

Edit `.github/workflows/deploy-containerapp.yml`:

```yaml
env:
  # For MCP support (Production)
  APIM_SKU_NAME: Basic
  APIM_SKU_CAPACITY: 1

  # Or for testing without MCP
  # APIM_SKU_NAME: Developer
  # APIM_SKU_CAPACITY: 1
```

### Option 2: After Deployment (Azure Portal)

1. Go to Azure Portal → API Management → `ai-security-apim`
2. Click **Pricing tier** in the left menu
3. Select new tier (Basic, Standard, or Premium)
4. Click **Save**

⚠️ **Note**: You can upgrade but cannot downgrade from Basic → Developer/Consumption.

### Option 3: After Deployment (Azure CLI)

```bash
# Upgrade to Standard for higher traffic
az apim update \
  --name ai-security-apim \
  --resource-group ai-security-rg \
  --sku-name Standard \
  --sku-capacity 1

# Scale capacity within same tier
az apim update \
  --name ai-security-apim \
  --resource-group ai-security-rg \
  --sku-capacity 2
```

## When to Upgrade

### Basic → Standard

Upgrade when you need:
- More than 10M API calls/month
- Higher throughput requirements
- 4 scale units instead of 2
- Still ~$700/month

### Standard → Premium

Upgrade when you need:
- Multi-region deployment
- Virtual network integration
- Unlimited scale units
- 99.99% SLA (vs 99.95%)
- ~$2,800+/month

## MCP Integration Example

Once deployed with Basic tier, you can register MCP servers:

```bash
# Create MCP server API in APIM
az apim api create \
  --resource-group ai-security-rg \
  --service-name ai-security-apim \
  --api-id mcp-tools-api \
  --display-name "MCP Tools API" \
  --service-url "https://your-mcp-server.com" \
  --path "/mcp" \
  --protocols https

# Add operations for MCP tools
az apim api operation create \
  --resource-group ai-security-rg \
  --service-name ai-security-apim \
  --api-id mcp-tools-api \
  --operation-id list-tools \
  --display-name "List Available Tools" \
  --method GET \
  --url-template "/tools"
```

## Monitoring Costs

### Set Up Alerts

```bash
# Create budget alert for APIM
az consumption budget create \
  --budget-name apim-monthly-budget \
  --amount 250 \
  --category Cost \
  --time-grain Monthly \
  --resource-group ai-security-rg

# Create alert when 80% of budget is reached
az monitor action-group create \
  --name budget-alerts \
  --resource-group ai-security-rg \
  --short-name BudgetAlert \
  --email-receiver admin admin@example.com
```

### View Current Costs

```bash
# Check APIM costs
az consumption usage list \
  --start-date $(date -d '1 month ago' +%Y-%m-%d) \
  --end-date $(date +%Y-%m-%d) \
  --query "[?contains(instanceName,'apim')].{Date:usageEnd, Cost:pretaxCost, Unit:unit}" \
  --output table
```

## Future Considerations

### When Consumption Tier Supports MCP

Microsoft has indicated that Consumption tier will eventually support MCP servers. When that happens:

**Migration Path:**
1. Create new Consumption tier APIM instance
2. Export APIs and policies from Basic tier
3. Import to Consumption tier
4. Update DNS/URLs
5. Delete Basic tier instance

**Cost Savings:** ~$135-165/month (Basic $185 → Consumption $20-35 for typical traffic)

**Timeline:** No official ETA from Microsoft yet

### Staying Updated

Check these resources for MCP support announcements:
- [Azure APIM Updates](https://azure.microsoft.com/en-us/updates/?product=api-management)
- [Azure APIM Roadmap](https://aka.ms/apim/roadmap)
- [MCP Protocol Docs](https://modelcontextprotocol.io/)

## Summary

✅ **Current Setup**: Basic tier for MCP server support
✅ **Cost**: ~$185-270/month (predictable)
✅ **Benefits**: Production SLA, AI Gateway, MCP integration
✅ **Alternative**: Use Developer tier (~$85-120/month) if MCP not needed yet
✅ **Future**: Can migrate to Consumption when MCP support arrives

**Bottom Line:** Basic tier is the right choice for production deployment with MCP server integration needs. The additional cost (~$135/month vs Consumption) provides production SLA and immediate AI Gateway capabilities.

---

**Questions?** See [APIM_SETUP.md](./APIM_SETUP.md) for detailed configuration or [APIM_INTEGRATION_SUMMARY.md](./APIM_INTEGRATION_SUMMARY.md) for quick reference.
