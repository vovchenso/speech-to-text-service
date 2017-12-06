FROM node:6

RUN mkdir -p /usr/src/app
COPY . /usr/src/app

WORKDIR /usr/src/app

# Build
RUN npm install
RUN npm run build

# Run server
ENTRYPOINT ["node", "dist/index.js"]
