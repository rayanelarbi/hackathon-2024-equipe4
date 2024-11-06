FROM node:22-alpine

WORKDIR /app

COPY ./back/package.json .

RUN npm install

COPY ./back .


EXPOSE 80

COPY  ./front /app/public


ENV ADDRESS=0.0.0.0 PORT=80

CMD ["npm", "start"]
