// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const userSwagger = require('../swaggerDocs/userSwagger');

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: 用戶登入
 *     description: 使用郵箱和密碼登入系統取得token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: 登入成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: 密碼錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 密碼錯誤
 *       404:
 *         description: 用戶不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 用戶不存在
 *       500:
 *         description: 服務器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 登入失敗
 *                 details:
 *                   type: string
 *                   example: 錯誤詳情信息
 */    
// 一般用戶登入
router.post('/login',userController.login);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: 註冊新用戶
 *     description: 創建一個新用戶
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: 用戶註冊成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: 550e8400-e29b-41d4-a716-446655440000
 *                 username:
 *                   type: string
 *                   example: john_doe
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: john@example.com
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-10-01T12:34:56.789Z
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-10-01T12:34:56.789Z
 *       400:
 *         description: 請求無效
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 請提供username、e-mail和password
 *       409:
 *         description: 用戶名或郵箱已存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: username或e-mail已被使用
 *       500:
 *         description: 服務器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 註冊失敗
 *                 details:
 *                   type: string
 *                   example: 錯誤詳情信息
 */
//用戶註冊
router.post('/register', userController.register);


/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: 獲取當前登入用戶信息
 *     description: 根據 JWT Token 獲取當前登入用戶的詳細信息
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功獲取用戶信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: 未提供 token 或 token 無效
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 未提供 token 或 無效的 token
 *                 details:
 *                   type: string
 *                   example: 錯誤詳情信息
 *       404:
 *         description: 用戶不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 用戶不存在
 */
// 獲取當前登入使用者資訊
router.get('/me', userController.getCurrentUser);

module.exports = router;