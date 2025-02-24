# since alpine is one of the smallest images...
FROM node:22-alpine

WORKDIR /app
COPY package*.json ./

RUN npm install --only=production

# copy all files except mentioned in dockerignore
COPY . .

# build
RUN npm run build
# open fastify port
EXPOSE 3000

CMD ["node", "dist/main.js"]
