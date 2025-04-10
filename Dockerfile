# 使用 Node.js 官方鏡像
FROM node:18

# 設置工作目錄
WORKDIR /app

# 安裝構建工具
RUN apt-get update && apt-get install -y python3 make g++ openssl

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製項目文件
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 暴露端口
EXPOSE 3000

# 啟動應用
CMD ["npm", "run", "dev"]