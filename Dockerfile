# base image
FROM node:10.4 as foreign-exchange-currency

## Stage 0, "build-stage", based on Node.js, to build and compile
# Set working directory
WORKDIR /app
COPY package*.json /app/
# Install dependencies
RUN npm install
# Copy to workdir app
COPY ./ /app/
# Build
RUN yarn build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=foreign-exchange-currency /app/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
# COPY --from=foreign-exchange-currency /nginx.conf /etc/nginx/conf.d/default.conf
