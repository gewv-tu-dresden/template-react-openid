FROM node:stretch-slim

ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Add all files
COPY . .

RUN yarn install && yarn build
RUN cd ./frontend && yarn install && yarn build

EXPOSE 8080
CMD [ "node", "build/server.js" ]