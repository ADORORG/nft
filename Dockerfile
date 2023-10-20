# syntax=docker/dockerfile:1

FROM node:18.15.0
RUN mkdir -p /app
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install
COPY . /app
EXPOSE 3000
RUN yarn build
CMD ["yarn", "start"]
