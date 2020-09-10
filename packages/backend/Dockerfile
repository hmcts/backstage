FROM nikolaik/python-nodejs:python3.8-nodejs12

WORKDIR /usr/src/app

COPY . .

RUN yarn install --frozen-lockfile --production

RUN pip install cookiecutter

CMD ["node", "packages/backend"]
