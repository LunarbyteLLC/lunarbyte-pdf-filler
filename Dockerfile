FROM node:16 as base

RUN apt-get update
RUN apt-get install -y libcairo2-dev libpoppler-qt5-dev poppler-data

WORKDIR /usr/api
COPY package.* /usr/api
RUN npm install
COPY . /usr/api

ENTRYPOINT ["npm", "run"]

FROM base as prod-builder
COPY --from=base /usr/api /usr/api
RUN npm run build
