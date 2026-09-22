# Câu 51: Khai báo Node.js Image
FROM node:20-alpine

# Câu 52: Thiết lập thư mục làm việc bên trong Frontend Container.
WORKDIR /app

# Câu 53: Sao chép package.json và package-lock.json vào Container.
COPY package*.json ./

# Câu 54: Cài đặt package
RUN npm install

# Câu 55: Sao chép source code React vào Container.
COPY . .

# Câu 56 & 57: Build React App (tạo ra thư mục dist)
RUN npm run build

# Khai báo port và lệnh chạy Frontend bằng server tĩnh
EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]