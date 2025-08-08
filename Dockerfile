FROM node:lts-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app
COPY . .

RUN npm install
RUN npx prisma generate

CMD ["npm", "run", "start"]