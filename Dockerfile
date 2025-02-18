FROM node:18-alpine
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
