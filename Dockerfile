# Sử dụng image Node.js Alpine v18.10.0
FROM node:18.10.0-alpine

# Thiết lập thư mục làm việc trong image
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependency
RUN npm install

# Sao chép thư mục build/dist vào thư mục làm việc trong image
COPY dist/ .

# Định nghĩa port mà ứng dụng lắng nghe
EXPOSE 3000

# Khởi chạy ứng dụng
CMD ["node", "index.js"]