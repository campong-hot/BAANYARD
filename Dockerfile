# BAANYARD investor demo — static web/ served by nginx.
# Public HTTPS: https://campong.online/projects/baanyard/
# TLS stays on the host reverse proxy; this image is HTTP :80 only.

FROM nginx:alpine

COPY deploy/nginx-container.conf /etc/nginx/conf.d/default.conf
COPY web/ /usr/share/nginx/html/projects/baanyard/

EXPOSE 80
