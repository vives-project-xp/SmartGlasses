FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run export

# Make scripts executable
RUN chmod +x /app/scripts/*.sh

EXPOSE 3000

# Use entrypoint to generate config at runtime
ENTRYPOINT ["/app/scripts/entrypoint.sh"]
