# Voting System Backend

## 專案簡介

這是一個基於 Node.js 和 Express 的投票系統後端專案，使用 Prisma 作為 ORM 工具，並與 PostgreSQL 數據庫集成。專案提供了用戶註冊、登入、投票活動管理、投票記錄等功能。

> 後端基礎架構由主管建立，本人參與部分功能開發與部分 Docker 部署設定。

## Technical Stack

- **後端框架**: [Express](https://expressjs.com/)
- **資料庫**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **身份驗證**: [JWT](https://jwt.io/)
- **容器化**: [Docker](https://www.docker.com/)

## 功能列表

- 用戶註冊與登入
- 投票活動的創建、更新、刪除
- 投票選項的管理
- 投票記錄的創建、修改、刪除
- API 文檔生成（使用 Swagger）

---

## 快速開始

### 環境要求

- Node.js 18 或更高版本
- Docker 和 Docker Compose
- PostgreSQL 數據庫

### Cheat Sheet

1. **Clone 專案**

   ```bash
   git clone https://github.com/Fang-33/angular-voting-system-be.git voting-system-be
   cd voteting-system-be
   ```

2. **install dependency**

   ```bash
   npm install
   ```

3. **enviorment setting**

   ### .env 檔案

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/voting_system"
   ```

4. **執行資料庫遷移**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **啟動開發服務器**

   ```bash
   npm run dev
   ```

6. **Docker**

   建立 Docker Image & 匯出 Image 檔案

   ```bash
     docker build -t voting-system .
     docker save -o voting_system.tar voting-system
   ```

   載入 Docker Image

   ```bash
     docker load -i voting_system.tar
   ```

   啟動 Docker 容器 與 停止 Docker 容器

   ```bash
     docker-compose up --build
     docker-compose down
     docker-compose up -d //背景運行
     docker-compose down -v //container and volume also removed
   ```

   移除暫存檔

   ```bash
     docker system prune -f //移除Cache
     docker image prune //移除未使用Image檔案
   ```

### API 文檔

專案使用 Swagger 生成 API 文檔。啟動服務後，訪問以下 URL 查看文檔：

Swagger UI: http://localhost:3000/api-docs

### 專案結構

```
voting-system-be/
|
├── src/
│ ├── controllers/ # 控制器
│ ├── routes/ # 路由
│ ├── utils/ # 工具函數
│ └── index.js # 入口檔案
├── prisma/
│ ├── schema.prisma # Prisma 資料模型
│ └── migrations/ # 資料庫遷移檔案
├── docker-compose.yml # Docker Compose 配置
├── Dockerfile # Docker 配置
├── package.json # 依賴管理
└── README.md # 專案文檔
```
