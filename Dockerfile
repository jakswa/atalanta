# building css
FROM oven/bun:latest as bunbuilder
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN bun x tailwindcss -i config/tailwind.css --config config/tailwind.config.js -o static/styles.css;
RUN gzip -r -k static

FROM pierrezemb/gostatic
COPY --from=bunbuilder /usr/src/app/static /srv/http
