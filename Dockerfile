# Use official Node.js image
FROM node:24-alpine

# Create working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma files and generate client
COPY prisma ./prisma


RUN npx prisma generate

# Copy the rest of the code
COPY . .

# Build the project
RUN npm run build

# Debug: List contents to verify build output
RUN ls -la
RUN ls -la dist/ || echo "dist directory not found"
RUN find . -name "main.js" -type f || echo "main.js not found"

# Expose port
EXPOSE 3000

# Alternative start command (adjust based on actual file location)
CMD ["sh", "-c", "if [ -f dist/main.js ]; then node dist/main.js; else node dist/src/main.js; fi"]