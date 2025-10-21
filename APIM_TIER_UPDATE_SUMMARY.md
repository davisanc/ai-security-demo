# APIM Tier Update Summary

## What Changed

Updated Azure API Management deployment from **Consumption tier** to **Basic tier** to support MCP (Model Context Protocol) servers.

## Why This Change?

According to Microsoft documentation:

> MCP servers are currently supported in **Basic, Standard, and Premium** tiers, both classic and v2. Support in the Developer and Consumption tiers is **coming soon**.

Since you want to use MCP servers with Azure AI Foundry, we need to use a tier that supports them now.

## Files Modified

### 1. `.github/workflows/deploy-containerapp.yml`

**Added environment variables:**
```yaml
# APIM SKU: Basic, Standard, or Premium support MCP servers
# Developer and Consumption tiers do NOT support MCP servers yet
APIM_SKU_NAME: Basic
APIM_SKU_CAPACITY: 1
```

**Updated APIM creation command:**
- Changed from `--sku-name Consumption` to `--sku-name ${{ env.APIM_SKU_NAME }}`
- Added `--sku-capacity ${{ env.APIM_SKU_CAPACITY }}`
- Updated deployment messages to indicate MCP support

### 2. `APIM_SETUP.md`

**Added sections:**
- MCP Server Support overview
- Tier comparison table showing MCP support status
- Why Basic tier explanation
- Future MCP integration example
- Updated cost section from Consumption to Basic tier pricing

**Updated sections:**
- Architecture diagram now shows MCP server integration
- Cost Management section with tier comparison table
- Upgrade/downgrade instructions

### 3. `APIM_INTEGRATION_SUMMARY.md`

**Updated sections:**
- Changed tier description from Consumption to Basic
- Added MCP support information
- Updated cost estimates (~$185-270/month instead of ~$35-85/month)
- Updated deployment time (30-45 min instead of 10-15 min for Basic tier)
- Added tier comparison table

### 4. `MCP_APIM_TIER_SELECTION.md` (NEW)

**Created comprehensive guide covering:**
- What are MCP servers and why they matter
- Tier comparison for MCP support
- Cost analysis (Basic vs Consumption vs Developer)
- When to upgrade/downgrade tiers
- How to change tiers after deployment
- MCP integration examples
- Cost monitoring setup
- Future considerations when Consumption adds MCP support

### 5. `README.md`

**Updated Azure Deployment section:**
- Added "Why Basic Tier?" explanation
- Listed MCP support as a security feature
- Updated architecture diagram
- Added link to `MCP_APIM_TIER_SELECTION.md`
- Updated deployment workflow description

## Cost Impact

### Before (Consumption Tier)
- **Low traffic (<1M calls/month)**: ~$35-70/month
- **Medium traffic (5M calls/month)**: ~$50-85/month
- **❌ No MCP server support**
- **❌ No production SLA**

### After (Basic Tier)
- **All traffic levels**: ~$185-270/month (fixed)
- **✅ MCP server support enabled**
- **✅ Production SLA (99.95%)**
- **✅ Up to 10M calls/month included**

### Additional Monthly Cost
**~$135-165 more per month** to enable MCP server support and production SLA.

## Benefits of Basic Tier

1. ✅ **MCP Server Integration** - Can use Azure AI Gateway features
2. ✅ **Production SLA** - 99.95% uptime guarantee
3. ✅ **Predictable Costs** - Fixed monthly rate, no surprises
4. ✅ **Included Calls** - 10M API calls/month included
5. ✅ **Managed Identity** - Better security integration
6. ✅ **Custom Domains** - Professional branding
7. ✅ **Easy Upgrade Path** - Can scale to Standard/Premium

## Alternative: Developer Tier

If you don't need MCP support immediately, you could use **Developer tier** (~$50-85/month total):

```yaml
env:
  APIM_SKU_NAME: Developer
  APIM_SKU_CAPACITY: 1
```

**Trade-offs:**
- ✅ Lower cost (~$85-120/month total)
- ❌ No MCP server support
- ❌ No production SLA
- ❌ Development use only

## Deployment Timeline

### First Deployment
- **MCP Server**: ~5 minutes
- **Web App**: ~5 minutes
- **APIM Basic Tier**: ~30-45 minutes (one-time setup)
- **Configuration**: ~1 minute

**Total**: ~45-60 minutes for first deployment

### Subsequent Deployments
- APIM updates: ~2-3 minutes
- **Total**: ~15-20 minutes

## Next Steps

1. **Review the configuration** in `.github/workflows/deploy-containerapp.yml`
2. **Update APIM_PUBLISHER_EMAIL** from `admin@example.com` to your actual email
3. **Commit and push** to trigger deployment
4. **Monitor GitHub Actions** for deployment progress
5. **Verify APIM creation** (will take 30-45 minutes first time)

## Future Migration

When Microsoft adds MCP support to Consumption tier:

### Option 1: Stay on Basic
- Keep production SLA
- Keep predictable costs
- Keep MCP features

### Option 2: Migrate to Consumption
- Save ~$135-165/month
- Lose production SLA
- Keep MCP features (when available)
- Pay-per-use pricing

See [MCP_APIM_TIER_SELECTION.md](./MCP_APIM_TIER_SELECTION.md) for detailed migration planning.

## Cost Monitoring

Set up budget alerts:

```bash
# Create monthly budget alert
az consumption budget create \
  --budget-name apim-monthly-budget \
  --amount 250 \
  --category Cost \
  --time-grain Monthly \
  --resource-group ai-security-rg
```

## References

- [Azure APIM Pricing](https://azure.microsoft.com/en-us/pricing/details/api-management/)
- [Azure APIM AI Gateway](https://learn.microsoft.com/en-us/azure/api-management/ai-gateway-overview)
- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [APIM_SETUP.md](./APIM_SETUP.md) - Detailed configuration guide
- [MCP_APIM_TIER_SELECTION.md](./MCP_APIM_TIER_SELECTION.md) - Tier selection analysis

## Questions?

**Q: Can I change the tier after deployment?**  
A: Yes, you can upgrade in Azure Portal or via Azure CLI. Note: Cannot downgrade from paid tiers to Consumption.

**Q: What if I don't need MCP servers right now?**  
A: Consider using Developer tier (~$50/month) for development, then upgrade to Basic when you need MCP.

**Q: When will Consumption tier support MCP?**  
A: Microsoft says "coming soon" but no specific timeline announced yet.

**Q: Can I test MCP integration now?**  
A: Yes! Basic tier supports all AI Gateway features. See [APIM_SETUP.md](./APIM_SETUP.md) for integration examples.

---

**Ready to deploy with Basic tier and MCP support!** 🚀
