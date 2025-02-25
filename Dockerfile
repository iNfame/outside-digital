# since alpine is one of the smallest images...
FROM node:22-alpine

WORKDIR /app
COPY package*.json ./

RUN npm install

# copy all files except mentioned in dockerignore
COPY . .

# build
RUN npm run build

# generate prisma client and/or migrations
RUN npx prisma generate

# open fastify port
EXPOSE 3000

CMD ["node", "dist/main.js"]
