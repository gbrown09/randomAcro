FROM node:16.9-slim As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16.9-slim As production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist
RUN mkdir -p ./environment
COPY ./environment/prod.env ./environment/prod.env

ENV NODE_ENV prod
CMD ["npm", "run", "start:docker-p"]