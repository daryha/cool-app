######################## BUILD ########################
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build                     

####################### RUNTIME #######################
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# минимальный standalone-сервер
COPY --from=build /app/.next/standalone ./
# статические ассеты
COPY --from=build /app/.next/static     ./public/_next/static
COPY --from=build /app/public           ./public

EXPOSE 3000
CMD ["node", "server.js"]
