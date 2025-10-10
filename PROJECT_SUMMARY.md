# AI Security Education Platform - Project Summary

## 🎯 Completed Features

### 1. **Home Page** (`/`)
- Animated security hub with AI center connected to 4 security categories
- Beautiful gradient animations and smooth transitions using Framer Motion
- Cards arranged in a circle with animated connection lines
- Each card includes customizable sub-bullet points

### 2. **Data Security Page** (`/data-security`)
- Two-pane layout with chat interface on the left
- Interactive chat with example prompts for:
  - Data Leakage
  - Direct Prompt Injection
  - Indirect Prompt Injection
  - Jailbreak Attempts
  - Sensitive Information Disclosure (LLM06)
  - Training Data Poisoning (LLM03)
- Right pane shows threat analysis and explanations
- Screenshot carousel ready for Defender for AI, Purview for AI, and Entra ID screenshots

### 3. **Threat Protection Page** (`/threat-protection`)
- Similar chat interface focused on OWASP LLM Top 10 threats
- Covers:
  - Model Denial of Service (LLM04)
  - Supply Chain Vulnerabilities (LLM05)
  - Insecure Plugin Design (LLM07)
  - Excessive Agency (LLM08)
  - Overreliance (LLM09)
  - Model Theft (LLM10)
- Detailed explanations and Microsoft security tool integration points

### 4. **Identity & Access Page** (`/identity-access`)
- Left pane: Agent sprawl visualization with 16 animated agent icons
- Interactive lifecycle stages (6 stages):
  - Creation, Authentication, Operation, Review, Modification, Decommissioning
- Each stage shows risks and controls
- Right pane: Screenshot carousel for Entra Agent ID demonstrations
- Click-through navigation for presentations

### 5. **Compliance Page** (`/compliance`)
- Left pane: Detailed breakdown of AI regulations
  - EU AI Act (risk classifications, requirements, controls)
  - US AI Executive Order 14110 (safety, privacy, equity, transparency)
- Right pane: Purview for AI Compliance Manager screenshots
- 6 screenshot slots ready for compliance demonstrations

### 6. **Backend API Structure** (`src/lib/api.ts`)
- Azure Foundry API client ready for integration
- Support for streaming responses
- OpenAI-compatible client for flexibility
- Clear customization points for API configuration

## 🎨 Key Features

✅ **Presentation-Ready**: Navigate with arrows, click images to advance
✅ **Fully Responsive**: Works on all screen sizes
✅ **Professional Animations**: Smooth transitions throughout
✅ **Customization Points**: Clearly marked in code with comments
✅ **Type-Safe**: Full TypeScript implementation
✅ **Educational Content**: Based on OWASP LLM Top 10 and real regulations

## 📝 Next Steps for You

1. **Add Screenshots**: Update URLs in each page for your Microsoft security tool screenshots
2. **Configure LLM Backend**: Add your Azure Foundry credentials in `src/lib/api.ts`
3. **Customize Content**: Modify sub-bullets and explanations as needed
4. **Test Presentation Flow**: Navigate through all pages to ensure smooth demo

## 🚀 Running the Application

```bash
cd ai-security-demo
npm install
npm run dev
```

Visit **http://localhost:3000** to see:
- Beautiful animated home page
- All 4 security sections working
- Interactive chat interfaces
- Screenshot placeholders ready for your content

## 💡 Customization Points

All code includes "CUSTOMIZATION POINT" comments showing exactly where to add your specific content, screenshots, and API configurations!

### Quick Customization Guide

**Home Page** - Add sub-bullets to security cards
**Data Security & Threat Protection** - Add screenshot URLs and integrate LLM backend
**Identity & Access** - Add Entra Agent ID screenshot URLs
**Compliance** - Add Purview Compliance Manager screenshot URLs
**API Integration** - Configure Azure Foundry credentials in `src/lib/api.ts`

## 📦 Technology Stack

- **Framework**: TanStack Start
- **UI**: ShadCN + Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## 🎓 Educational Content Covered

- OWASP LLM Top 10 (LLM01, LLM03-LLM10)
- Data Security threats and mitigations
- AI agent lifecycle management
- EU AI Act compliance requirements
- US AI Executive Order standards
- Microsoft security tools integration points
