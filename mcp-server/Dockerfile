FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm install -g typescript
RUN npm run build

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "dist/server.js"]
