FROM node:14-alpine

WORKDIR /app

COPY . .

RUN npm run build

CMD ["npm", "start"]

EXPOSE 3000
