# base image
FROM node:10.4

## Stage 1
# Set working directory
WORKDIR /app
COPY . ./
# Install dependencies and build
RUN yarn
RUN yarn build

EXPOSE 8080
## Stage 2 - the production environment
#FROM nginx:alpine
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#COPY --from=react-build /app/build /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
