# Stage 1: Build React App
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve dengan Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Catatan: Jika kamu pakai Create React App (CRA), ubah '/app/dist' jadi '/app/build'
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]