const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// 通用函數
const findFirstRecord = async (poll_id, userId) => {
  return await prisma.voteRecord.findFirst({
    where: {
      poll_id: poll_id,
      user_id: userId
    }
  });
};

const findFirstPoll = async (poll_id) => {
  return await prisma.poll.findUnique({
    where: {
      id: poll_id
    }
  });
};

const findOptions = async (poll_id) => {
  return await prisma.option.findMany({
    where: {
      poll_id: poll_id
    }
  });
};

// 驗證函數
const validateToken = (token) => {
  if (!token) {
    throw new Error('未提供 token');
  }
  return jwt.verify(token, 'your-secret-key');
};

const validatePollExists = async (poll_id) => {
  const poll = await findFirstPoll(poll_id);
  if (!poll) {
    throw new Error('該活動不存在');
  }
  return poll;
};

const validateOptionExists = async (poll_id, option_id) => {
  const options = await findOptions(poll_id);
  const isValidOption = options.find((option) => option.id === option_id);
  if (!isValidOption) {
    throw new Error('沒這個選項，投了個寂寞');
  }
};

const validateDuplicateVote = async (poll_id, user_id, option_id) => {
  const existRecord = await findFirstRecord(poll_id, user_id);
  if (existRecord && existRecord.option_id === option_id) {
    throw new Error('重複相同選項投票');
  }
  return existRecord;
};


const createVote = async (req, res) => {
  try {
    const { id: poll_id } = req.params;
    const { option_id } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    const decoded = validateToken(token);
    await validatePollExists(poll_id);
    await validateOptionExists(poll_id, option_id);
    await validateDuplicateVote(poll_id, decoded.userId, option_id);

    const newVote = await prisma.voteRecord.create({
      data: {
        poll_id,
        option_id,
        user_id: decoded.userId,
      },
    });
    res.json(newVote);
  } catch (error) {
    res.status(400).json({ error: '投票失敗', details: error.message });
  }
};

const editVote = async (req, res) => {
  try {
    const { id: poll_id } = req.params;
    const { option_id } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    const decoded = validateToken(token);
    const existRecord = await findFirstRecord(poll_id, decoded.userId);
    
    if (!existRecord) {
      throw new Error('找不到投票記錄');
    }

    const updatedVote = await prisma.voteRecord.update({
      where: { id: existRecord.id },
      data: { option_id },
    });
    res.json(updatedVote);
  } catch (error) {
    res.status(400).json({ error: '修改投票失敗', details: error.message });
  }
};

const deleteVote=async (req, res) => {
  try {
    const { id: poll_id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    const decoded = validateToken(token);
    const record = await findFirstRecord(poll_id, decoded.userId);
    
    if (!record) {
      throw new Error('找不到投票記錄');
    }

    const deleteVote = await prisma.voteRecord.delete({
      where: { id: record.id },
    });
    res.json(deleteVote);
  } catch (error) {
    res.status(400).json({ error: '刪除投票失敗', details: error.message });
  }
}
module.exports = {
    createVote,
    editVote,
    deleteVote
  };