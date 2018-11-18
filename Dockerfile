# stage: 1
FROM node:8 as foreign-exchange-app
WORKDIR /app
COPY . ./
RUN yarn install
RUN yarn build
# stage: 2 — the production environment
FROM nginx:alpine
# COPY -- from=foreign-exchange-app /app/build /usr/share/nginx/html
EXPOSE 80
CMD ['“nginx”', '“-g”', '“daemon off;”']
