const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login=async (req, res) => {  
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: '用戶不存在' });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: '密碼錯誤' });
      }
      const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: '登入失敗', details: error.message });
    }
  };


const  register = async (req, res) => {
  const { username, email, password } = req.body;

  // 檢查必填字段
  if (!username || !email || !password) {
    return res.status(400).json({ error: '請提供 username、e-mail 和 password' });
  }

  try {
    // 檢查用戶名或郵箱是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'username 或 e-mail 已被使用' });
    }

    // 加密密碼
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 創建新用戶
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // 返回新用戶信息（不返回密碼）
    const userWithoutPassword = { ...newUser, password: undefined };
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: '註冊失敗', details: error.message });
  }
};

const getCurrentUser = async(req, res) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: '未提供 token' });
      }
      try {
        const decoded = jwt.verify(token, 'your-secret-key');
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
          return res.status(404).json({ error: '用戶不存在' });
        }
        res.json(user);
      } catch (error) {
        res.status(401).json({ error: '無效的 token', details: error.message });
      }
    }

    module.exports = {
        login,
        register,
        getCurrentUser,
      };