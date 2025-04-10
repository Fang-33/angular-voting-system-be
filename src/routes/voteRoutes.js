// src/routes/userRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // 啟用 mergeParams
const voteController = require('../controllers/voteController');

/**
 * @swagger
 * /api/polls/{id}/vote:
 *   post:
 *     summary: 參與投票
 *     description: 為指定投票活動參與投票
 *     tags: [Vote]
 *     security:
 *       - bearerAuth: []
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
 *             required:
 *               - option_id
 *             properties:
 *               option_id:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: 投票成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoteRecord'
 *       400:
 *         description: 請求無效
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 投票失敗
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
// 參與投票
router.post('/', voteController.createVote);

/**
 * @swagger
 * /api/polls/{id}/vote:
 *   put:
 *     summary: 修改投票
 *     description: 修改指定投票活動的投票選項
 *     tags: [Vote]
 *     security:
 *       - bearerAuth: []
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
 *             required:
 *               - option_id
 *             properties:
 *               option_id:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: 投票修改成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoteRecord'
 *       400:
 *         description: 請求無效
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 修改投票失敗
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
//  修改投票
router.put('/', voteController.editVote);

/**
 * @swagger
 * /api/polls/{id}/vote:
 *   delete:
 *     summary: 刪除投票
 *     description: 刪除指定投票活動的投票記錄
 *     tags: [Vote]
 *     security:
 *       - bearerAuth: []
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
 *         description: 投票刪除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoteRecord'
 *       400:
 *         description: 請求無效
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 刪除投票失敗
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
//   刪除投票
router.delete('/', voteController.deleteVote);

module.exports = router;