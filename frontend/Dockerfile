# Dockerfile for frontend
FROM nginx:stable-alpine

# Copy the custom nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static HTML file
COPY ./index.html /usr/share/nginx/html/index.html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]