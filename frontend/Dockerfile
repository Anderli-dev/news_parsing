# syntax=docker/dockerfile:1.4
FROM node:19.5.0 AS development

WORKDIR /frontend

ENV PATH /frontend/node_modules/.bin:$PATH
COPY frontend/package.json /frontend/package.json
COPY frontend/package-lock.json /frontend/package-lock.json

RUN npm ci --legacy-peer-deps

COPY frontend/. /frontend

CMD ["npm", "run", "build"]
EXPOSE 3000

CMD [ "npm", "start" ]
