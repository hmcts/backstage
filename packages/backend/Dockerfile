FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN apt-get update -y
RUN apt-get install -y cookiecutter

RUN yarn install --frozen-lockfile --production

CMD ["node", "packages/backend"]
