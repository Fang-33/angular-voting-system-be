const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const getPolls =async (req, res) => {
    const { status } = req.query; // 狀態篩選（例如：active, ended）
    try {
      const polls = await prisma.poll.findMany({
        where: {
          ...(status === 'active' && { end_time: { gt: new Date() } }),
          ...(status === 'ended' && { end_time: { lte: new Date() } }),
        },
        include: {
          options: true,
          voteRecords: {
            include: {
              user: true, // 在 voteRecords 中關聯 user
            },
          },
          user:true,
        },
      });
      // 手動過濾關聯物件的欄位
      const processedPolls = polls.map(poll => ({
        ...poll, // 保留當前物件的所有欄位
        voteRecords: poll.voteRecords.map(record => ({
          ...record,
         user:{
            id: record.user.id, // 只保留 user 的 username
            username: record.user.username, // 只保留 user 的 username
          }
        })),
        user: {
            id: poll.user.id, // 只保留 user 的 username
             username: poll.user.username, // 只保留 user 的 username
        },
      }));
      res.json(processedPolls);
    } catch (error) {
      res.status(500).json({ error: '獲取投票活動失敗', details: error.message });
    }
  };

const getPollById =async (req, res) => {
    const { id } = req.params;
    try {
      const poll = await prisma.poll.findUnique({
        where: { id },
        include: {
          options: true,
          voteRecords: {
            include: {
              user: true, // 在 voteRecords 中關聯 user
            },
          },
          user:true,
        },
      });
      if (!poll) {
        return res.status(404).json({ error: '投票活動不存在' });
      }
      // 手動過濾關聯物件的欄位
      const processedPoll = {
        ...poll, // 保留當前物件的所有欄位
        voteRecords: poll.voteRecords.map(record => ({
          ...record,
         user:{
            id: record.user.id, // 只保留 user 的 username
            username: record.user.username, // 只保留 user 的 username
          }
        })),
        user: {
            id: poll.user.id, // 只保留 user 的 username
             username: poll.user.username, // 只保留 user 的 username
        },
      };
      res.json(processedPoll);
    } catch (error) {
      res.status(500).json({ error: '獲取投票活動詳情失敗', details: error.message });
    }
}

const createPoll = async (req, res) => {
    const { title, description, end_time, is_anonymous, options } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: '未提供 token' });
    }
    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        const newPoll = await prisma.poll.create({
          data: {
            title,
            description,
            end_time: new Date(end_time),
            is_anonymous,
            created_by: decoded.userId,
            options: {
              create: options.map((option, index) => ({
                text: option.text,
                sequence: index + 1,
              })),
            },
          },
          include: {
            options: true,
          },
        });
        res.json(newPoll);
    } catch (error) {
        res.status(400).json({ error: '創建投票活動失敗', details: error.message });
    }
};

const editPoll =async (req, res) => {
    const { id } = req.params;
    const { title, description, end_time, is_anonymous, options } = req.body;
    try {
          // 首先獲取現有的投票和選項
          const existingPoll = await prisma.poll.findUnique({
            where: { id },
            include: { options: true }
            });

          if (!existingPoll) {
              return res.status(404).json({ error: '投票活動不存在' });
           }

          // 準備選項更新操作
          const optionUpdates = [];
          const existingOptionIds = existingPoll.options.map(option => option.id);
          const newOptionIds = options.filter(option => option.id).map(option => option.id);

          // 處理刪除的選項
          const optionsToDelete = existingOptionIds.filter(id => !newOptionIds.includes(id));
            if (optionsToDelete.length > 0) {
                optionUpdates.push(
                  prisma.option.deleteMany({
                      where: { id: { in: optionsToDelete } }
                  })
                );
            }

            // 處理新增和更新的選項
            options.forEach((option, index) => {
              if (option.id && option.id !== '') {
                  // 更新現有選項
                  optionUpdates.push(
                      prisma.option.update({
                          where: { id: option.id },
                          data: {
                              text: option.text,
                              sequence: index + 1
                          }
                      })
                  );
              } else {
                  // 新增選項
                  optionUpdates.push(
                      prisma.option.create({
                          data: {
                              text: option.text,
                              sequence: index + 1,
                              poll_id: id
                          }
                      })
                  );
              }
          });

           // 使用事務執行所有更新操作
            const [updatedPoll, ...updatedOptions] = await prisma.$transaction([
          // 更新投票基本信息
              prisma.poll.update({
                  where: { id },
                  data: {
                      title,
                      description,
                      end_time: new Date(end_time),
                      is_anonymous
                  }
              }),
              // 執行所有選項更新操作
              ...optionUpdates
          ]);

      // 獲取更新後的完整投票數據
      const result = await prisma.poll.findUnique({
          where: { id },
          include: { options: true }
      });

      res.json(result);
        } catch (error) {
          res.status(400).json({ error: '更新投票活動失敗', details: error.message });
    }
};

const deletePoll = async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.$transaction(async (tx) => {
      // 刪除相關的投票記錄
      await tx.voteRecord.deleteMany({
        where: { poll_id: id }
      });
      
      // 刪除相關的選項
      await tx.option.deleteMany({
        where: { poll_id: id }
      });
      
      // 刪除投票本身
      await tx.poll.delete({
        where: { id }
      });
    });
    
    res.json({ message: '投票活動已刪除' });
  } catch (error) {
    res.status(400).json({ error: '刪除投票活動失敗', details: error.message });
  }
};

module.exports = {
    getPolls,
    getPollById,
    createPoll,
    editPoll,
    deletePoll,
  };