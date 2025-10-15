# MCP Server

Model Context Protocol server for the AI Security Demo application. Provides secure AI inference with built-in content safety and threat detection.

## Features

- ✅ Azure OpenAI integration
- ✅ Content safety analysis
- ✅ Threat detection (prompt injection, jailbreak attempts)
- ✅ CORS support
- ✅ Health check endpoint
- ✅ TypeScript support

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file**:
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your Azure OpenAI credentials**

4. **Run in development mode**:
   ```bash
   npm run dev
   ```

5. **Build**:
   ```bash
   npm run build
   ```

6. **Run production build**:
   ```bash
   npm start
   ```

## API Endpoints

### Health Check
```
GET /health
```

Returns server status.

### Chat Completion
```
POST /api/chat
```

Request body:
```json
{
  "messages": [
    {"role": "user", "content": "Hello"}
  ],
  "temperature": 0.7,
  "maxTokens": 500,
  "enableContentSafety": true,
  "enableThreatDetection": true
}
```

Response:
```json
{
  "content": "AI response here",
  "safetyAnalysis": {...},
  "threatDetection": {...},
  "usage": {...}
}
```

## Docker

Build:
```bash
docker build -t mcp-server .
```

Run:
```bash
docker run -p 8080:8080 --env-file .env mcp-server
```

## Deployment

This server is deployed to Azure Container Apps via GitHub Actions. See the main repository's deployment guide for details.
