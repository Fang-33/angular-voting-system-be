const express = require('express');
const userRoutes = require('./routes/userRoutes');
const pollRoutes = require('./routes/pollRoutes');
const voteRoutes = require('./routes/voteRoutes');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const prisma = new PrismaClient();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const app = express();
const port = 3000;

// 啟用 CORS
app.use(cors({
  origin: 'http://localhost:4200',  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析 JSON 請求體
app.use(express.json());


// Swagger 配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '投票系統 API',
      version: '1.0.0',
      description: '投票系統 API 文檔',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: { //todo 改成動態
        User:{
          type: 'object',
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            username: { type: 'string', example: 'username' },
            email: { type: 'string', example: 'email' },
            password: { type: 'string', example: 'password' },
            created_at: { type: 'string', example: 'created_at' },
            updated_at: { type: 'string', example: 'updated_at' },
          }
        },
        Poll:{
          type: 'object',
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            title: { type: 'string', example: 'title' },
            description: { type: 'string', example: 'description' },
            created_by: { type: 'string', example: '3d94e6b4-a0f9-4433-b534-8b7d09b8e2cc' },
            created_at: { type: 'string', example: '2025-03-19T05:30:26.248Z' },
            updated_at: { type: 'string', example: '2025-03-19T05:30:26.248Z' },
            end_time: { type: 'string', example: 'end_time' },
            is_anonymous: { type: 'boolean', example: 'is_anonymous' },
            options: { type: 'string', example: [{
                id: "960df0e3-8e2f-4ab4-a525-118c3362a77e",
                poll_id: "550e8400-e29b-41d4-a716-446655440000",
                text: "option text",
                sequence: 1
              }] },
            voteRecords: { type: 'string', example: [{
                id: "8037944b-5f11-4a0b-b332-2f294b8b95ce",
                poll_id: "550e8400-e29b-41d4-a716-446655440000",
                option_id: "1e491761-38b6-4147-b103-11b6ca615c3d",
                user_id: "3d94e6b4-a0f9-4433-b534-8b7d09b8e2cc",
                created_at: "2025-03-24T05:47:40.870Z",
                updated_at: "2025-03-24T05:47:40.870Z",
                user: {
                    id: "3d94e6b4-a0f9-4433-b534-8b7d09b8e2cc",
                    username: "username"
                }

            }],
            },
            user: { type: 'string', example: {id: 'created_user_id',username:'created_user_id'} },
          }
        },
        Option:{
          type: 'object',
            properties: {
              id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
              poll_id: { type: 'string', example: 'poll_id' },
              text: { type: 'string', example: 'text' },
              sequence: { type: 'integer', example: 'sequence' },
              }
        },
        VoteRecord:{
          type: 'object',
            properties: {
              id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
              poll_id: { type: 'string', example: 'poll_id' },
              option_id: { type: 'string', example: 'option_id' },
              user_id: { type: 'string', example: 'user_id' },
              created_at: { type: 'string', example: 'created_at' },
              updated_at: { type: 'string', example: 'updated_at' },
            }
        }
      },         
    },
    },
  apis: ['./src/routes/*.js','./src/utils/*.js'], // 加載路由文件和 Swagger 註釋文件
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
// 提供 Swagger UI
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


// 加載路由
app.use('/api/users', userRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/polls/:id/vote', voteRoutes);

// 啟動服務器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});