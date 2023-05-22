FROM node:18.16-alpine3.17 AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --silent --immutable

COPY src ./src
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY migration ./migration
COPY config ./config

RUN yarn build

FROM node:18.16-alpine3.17 AS final

COPY --from=build /app/node_modules ./node_modules/
COPY --from=build /app/dist ./dist/
COPY nest-cli.json ./
COPY tsconfig.json ./
COPY package.json ./

CMD ["sh", "-c", "yarn start:prod"]
