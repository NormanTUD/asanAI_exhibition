FROM node:18-alpine
WORKDIR /app
COPY . /app/
RUN cd /app && npm install -g npm@latest && npm install
RUN yarn install --production .
EXPOSE 3000

#RUN yarn
#CMD yarn start
CMD ["node", "/app/src/index.js"]
