# 1단계: 빌드 스테이지
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 실행 스테이지
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 포트
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
