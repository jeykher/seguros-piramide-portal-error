# PORTAL ERROR CONTAINER IMAGE

# STAGE 1 DEPENDENCIES INSTALLATION PROCESS

FROM node:16-alpine3.13 AS install

RUN apk add --no-cache libc6-compat

RUN apk add vim -v --progress

RUN apk add nano -v --progress

WORKDIR /home/node/app

COPY package.json ./

RUN yarn install

# STAGE 2 APP BUILDING PROCESS

FROM node:16-alpine3.13 AS build

RUN apk add --no-cache libc6-compat

RUN apk add vim -v --progress

RUN apk add nano -v --progress

WORKDIR /home/node/app

RUN mkdir node_modules

COPY . .

COPY --from=install /home/node/app/node_modules ./node_modules

COPY --from=install /home/node/app/yarn.lock .

ENV GENERATE_SOURCEMAP=false

ENV NODE_OPTIONS=openssl-legacy-provider

ENV PUBLIC_URL=/gestionerror360

RUN yarn build

# STAGE 3 DESPLIEGUE DE LA APLICACION EN SERVIDOR NGINX

FROM nginx:1.21.4-alpine

RUN apk add --no-cache libc6-compat

RUN apk add vim -v --progress

RUN apk add nano -v --progress

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

RUN mkdir ./gestionerror360

RUN chown -R nginx:nginx ./gestionerror360

COPY default.conf /etc/nginx/conf.d

COPY --from=build --chown=nginx:nginx /home/node/app/build /usr/share/nginx/html/gestionerror360

RUN touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid  && chown -R nginx:nginx /var/cache/nginx/

EXPOSE 9002

USER nginx

ENTRYPOINT ["nginx", "-g", "daemon off;"]