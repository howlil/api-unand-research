# Gunakan base image dengan Node.js di Alpine
FROM node:alpine

# Set working directory
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi sistem yang diperlukan (libssl, libc)
RUN apk add --no-cache openssl1.1-compat libstdc++ bash

# Instal dependensi Node.js
RUN npm install

# Instal Prisma sebagai dev dependency
RUN npm install prisma --save-dev

# Salin semua file aplikasi
COPY . .

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Generate Prisma client
RUN npx prisma generate

# Expose port 8080
EXPOSE 8080

# Jalankan aplikasi
CMD ["npm", "start"]
