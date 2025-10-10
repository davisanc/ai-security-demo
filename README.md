# AI Security Education Platform

A comprehensive, interactive web application built with TanStack Start showcasing AI security concepts, threats, and compliance frameworks. Perfect for educational presentations to both business users and technical audiences.

## 🌟 Features

### Interactive Security Modules

1. **Home Page** - Animated security hub with 4 main categories connected to a central AI core
2. **Data Security** - Chat interface demonstrating data leakage, prompt injection, and jailbreak detection
3. **Threat Protection** - Advanced threat scenarios based on OWASP LLM Top 10
4. **Identity & Access** - Agent lifecycle management and governance visualization
5. **Compliance** - EU AI Act and US AI Executive Order requirements with controls

### Technology Stack

- **Framework**: TanStack Start (React-based full-stack framework)
- **UI Components**: ShadCN UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd ai-security-demo
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Build for Production

```bash
npm run build
npm run start
```

## 🎨 Customization Points

The application is designed with multiple customization points clearly marked in the code:

### 1. Home Page Content (`src/routes/index.tsx`)

Add custom sub-bullets or text to each security category:

```typescript
subPoints: [
  'Your custom point 1',
  'Your custom point 2',
  // Add more...
]
```

### 2. Data Security Page (`src/routes/data-security.tsx`)

**Add Screenshot URLs:**
```typescript
const threatExamples = [
  {
    // ...
    defenderScreenshotUrl: 'https://your-url.com/screenshot.png',
    purviewScreenshotUrl: 'https://your-url.com/screenshot2.png',
    entraScreenshotUrl: 'https://your-url.com/screenshot3.png',
  }
]
```

**Integrate LLM Backend:**

Replace the mock implementation in `handleSendMessage()` with actual API calls:

```typescript
import { createAzureFoundryClient } from '~/lib/api'

const client = createAzureFoundryClient()
const response = await client.createChatCompletion({
  messages: [
    { role: 'system', content: 'You are a security assistant...' },
    { role: 'user', content: inputValue }
  ]
})
```

### 3. Threat Protection Page (`src/routes/threat-protection.tsx`)

Same customization points as Data Security page - add screenshots and integrate your LLM backend.

### 4. Identity & Access Page (`src/routes/identity-access.tsx`)

**Add Entra Agent ID Screenshots:**

```typescript
const screenshots = [
  {
    id: 'overview',
    title: 'Agent Identity Dashboard',
    url: 'https://your-url.com/screenshot.png', // Add URL here
  },
  // Add more screenshots...
]
```

### 5. Compliance Page (`src/routes/compliance.tsx`)

**Add Purview Compliance Manager Screenshots:**

```typescript
const screenshots = [
  {
    id: 'dashboard',
    title: 'Compliance Dashboard',
    url: 'https://your-url.com/screenshot.png', // Add URL here
  },
  // Add more screenshots...
]
```

### 6. LLM Backend Integration (`src/lib/api.ts`)

**Option 1: Environment Variables (Recommended)**

Create a `.env` file:

```env
AZURE_FOUNDRY_ENDPOINT=https://your-resource.openai.azure.com
AZURE_FOUNDRY_API_KEY=your-api-key-here
AZURE_FOUNDRY_DEPLOYMENT=gpt-4
AZURE_FOUNDRY_API_VERSION=2024-08-01-preview
```

**Option 2: Direct Configuration**

Edit `src/lib/api.ts`:

```typescript
export function createAzureFoundryClient(): AzureFoundryClient {
  const config: LLMConfig = {
    endpoint: 'https://your-resource.openai.azure.com',
    apiKey: 'your-api-key-here',
    deploymentName: 'gpt-4',
    apiVersion: '2024-08-01-preview',
  }
  return new AzureFoundryClient(config)
}
```

## 📊 Presentation Mode

The application is designed for live presentations:

- **Screenshot Navigation**: Use arrow buttons or click images to advance
- **Interactive Demos**: Type example prompts to demonstrate threat detection
- **Smooth Animations**: Framer Motion provides professional transitions
- **Responsive Design**: Works on various screen sizes

### Tips for Presenting

1. Start at the home page to show the overall security framework
2. Click each category to dive into specific topics
3. Use example prompts in chat interfaces to demonstrate threat detection
4. Navigate through screenshots while explaining each Microsoft security tool
5. Return to home using the "Back to Home" link

## 🛠️ Project Structure

```
ai-security-demo/
├── src/
│   ├── routes/
│   │   ├── index.tsx                 # Home page with animated cards
│   │   ├── data-security.tsx         # Data security chat interface
│   │   ├── threat-protection.tsx     # Threat protection scenarios
│   │   ├── identity-access.tsx       # Identity lifecycle management
│   │   └── compliance.tsx            # Compliance frameworks
│   ├── lib/
│   │   ├── api.ts                    # LLM API integration utilities
│   │   └── utils.ts                  # Utility functions
│   ├── components/                   # Reusable components
│   └── styles.css                    # Global styles
├── public/                           # Static assets
└── package.json
```

## 🔒 Security Considerations

- Never commit API keys to version control
- Use environment variables for sensitive configuration
- Implement proper authentication for production deployments
- Add rate limiting for API endpoints
- Validate and sanitize all user inputs

## 📚 Educational Content

The application covers:

### OWASP LLM Top 10
- LLM01: Prompt Injection
- LLM03: Training Data Poisoning
- LLM04: Model Denial of Service
- LLM05: Supply Chain Vulnerabilities
- LLM06: Sensitive Information Disclosure
- LLM07: Insecure Plugin Design
- LLM08: Excessive Agency
- LLM09: Overreliance
- LLM10: Model Theft

### Compliance Frameworks
- EU AI Act requirements and risk classifications
- US AI Executive Order standards
- Control implementation guidance
- Documentation and auditing requirements

### Microsoft Security Tools
- Microsoft Defender for AI
- Microsoft Purview for AI
- Microsoft Entra Agent ID

## 🤝 Contributing

This is a demonstration project. Feel free to:
- Add more threat scenarios
- Enhance the UI/UX
- Integrate additional compliance frameworks
- Improve LLM integration

## 📄 License

This project is provided as-is for educational purposes.

## 🙏 Acknowledgments

- Built with [TanStack Start](https://tanstack.com/start)
- UI components from [ShadCN](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Security content based on [OWASP LLM Top 10](https://genai.owasp.org/llm-top-10/)

## 📞 Support

For questions or issues, please refer to the inline code comments marked with "CUSTOMIZATION POINT" for guidance on modifying the application.

---

**Happy Presenting! 🎉**
