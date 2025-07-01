#############
### build ###
#############

FROM node:22-alpine AS build
# add nodejs, create group node, create user node, create folder to run app in and give exlusive rights to new node user
RUN apk add --no-cache --update tzdata && mkdir -p /usr/src/app && chown node:node /usr/src/app && rm -vrf /var/cache/apk/*
# set timezone to local time
ENV TZ=Europe/Brussels
RUN npm set progress=false && npm config set depth 0

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH=/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm i

# add app
COPY . /app

# generate build
RUN ng build --configuration production --output-path=dist

############
### prod ###
############

# base image
FROM node:22-alpine

#remove all content form html
COPY --from=build /app/dist /app/dist

WORKDIR /app
CMD node dist/server/server.mjs

# expose port 80
EXPOSE 80
