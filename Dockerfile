FROM node:lts-alpine

# comment for non HTTPS
COPY secrets/server.key /etc/ssl/private/hrh-dwh.key
COPY secrets/server.crt /etc/ssl/certs/hrh-dwh.crt

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD ["node", "app.js"]