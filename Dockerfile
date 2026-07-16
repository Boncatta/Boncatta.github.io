FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8787

COPY . .

EXPOSE 8787
CMD ["node", "server/index.mjs"]
