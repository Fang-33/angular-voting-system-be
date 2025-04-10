// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController.js');

/**
 * @swagger
 * /api/polls:
 *   get:
 *     summary: 獲取投票活動列表
 *     description: 根據狀態篩選獲取投票活動列表（例如：active, ended）
 *     tags: [Polls]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, ended]
 *         description: 投票活動狀態（active - 進行中, ended - 已結束）
 *     responses:
 *       200:
 *         description: 成功獲取投票活動列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Poll'
 *       500:
 *         description: 服務器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 獲取投票活動失敗
 *                 details:
 *                   type: string
 *                   example: 錯誤詳情信息
 */
// 獲取投票活動列表，支援狀態篩選
router.get('/', pollController.getPolls);

/**
 * @swagger
 * /api/polls/{id}:
 *   get:
 *     summary: 獲取特定投票活動詳情
 *     description: 根據 ID 獲取特定投票活動的詳細信息
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 投票活動的 ID
 *     responses:
 *       200:
 *         description: 成功獲取投票活動詳情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Poll'
 *       404:
 *         description: 投票活動不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 投票活動不存在
 *       500:
 *         description: 服務器錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 獲取投票活動詳情失敗
 *                 details:
 *                   type: string
 *                   example: 錯誤詳情信息
 */
// 獲取特定投票活動詳情
router.get('/:id', pollController.getPollById);

/**
 * @swagger
 * /api/polls:
 *   post:
 *     summary: 創建新投票活動
 *     description: 創建一個新投票活動
 *     tags: [Polls]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - end_time
 *               - is_anonymous
 *               - options
 *             properties:
 *               title:
 *                 type: string
 *                 example: 最喜歡的編程語言
 *               description:
 *                 type: string
 *                 example: 請選擇你最喜歡的編程語言。
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2023-12-31T23:59:59Z
 *               is_anonymous:
 *                 type: boolean
 *                 example: false
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: JavaScript
 *     responses:
 *       201:
 *         description: 投票活動創建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Poll'
 *       400:
 *         description: 請求無效
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 創建投票活動失敗
 *                 details:
 *                   type: string
 *                   example: 錯誤詳情信息
 *       401:
 *         description: 未提供 token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 未提供 token
 */
 // 創建新投票活動
 router.post('/', pollController.createPoll);

 /**
 * @swagger
 * /api/polls/{id}:
 *   put:
 *     summary: 更新投票活動
 *     description: 根據 ID 更新投票活動的詳細訊息與 Options 的修改
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 投票活動的 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 最喜歡的編程語言
 *               description:
 *                 type: string
 *                 example: 請選擇你最喜歡的編程語言。
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2023-12-31T23:59:59Z
 *               is_anonymous:
 *                 type: boolean
 *                 example: false
 *               options:
 *                 type: array
 *                 minItems: 2
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       description: 現有選項的ID（如為更新操作）
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     text:
 *                       type: string
 *                       minLength: 1
 *                       maxLength: 100
 *                       description: 選項文本
 *                       example: "JavaScript"
 *     responses:
 *       200:
 *         description: 投票活動更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Poll'
 *       400:
 *         description: 請求無效
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 更新投票活動失敗
 *                 details:
 *                   type: string
 *                   example: 錯誤詳情信息
 */
 // 更新投票活動
 router.put('/:id', pollController.editPoll);

 /**
 * @swagger
 * /api/polls/{id}:
 *   delete:
 *     summary: 刪除投票活動
 *     description: 根據 ID 刪除投票活動
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 投票活動的 ID
 *     responses:
 *       200:
 *         description: 投票活動刪除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 投票活動已刪除
 *       400:
 *         description: 請求無效
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 刪除投票活動失敗
 *                 details:
 *                   type: string
 *                   example: 錯誤詳情信息
 */
 // 刪除投票活動
 router.delete('/:id', pollController.deletePoll);

module.exports = router;