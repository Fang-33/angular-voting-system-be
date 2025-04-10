const register ={
    register: `
    /api/user/register:
      post:
        summary: 註冊新用戶
        description: 創建一個新用戶
        tags:
          - 用戶管理
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                required:
                  - username
                  - email
                  - password
                properties:
                  username:
                    type: string
                    example: john_doe
                  email:
                    type: string
                    format: email
                    example: john@example.com
                  password:
                    type: string
                    format: password
                    example: password123
        responses:
          201:
            description: 用戶註冊成功
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    id:
                      type: string
                      format: uuid
                      example: 550e8400-e29b-41d4-a716-446655440000
                    username:
                      type: string
                      example: john_doe
                    email:
                      type: string
                      format: email
                      example: john@example.com
                    created_at:
                      type: string
                      format: date-time
                      example: 2023-10-01T12:34:56.789Z
                    updated_at:
                      type: string
                      format: date-time
                      example: 2023-10-01T12:34:56.789Z
          400:
            description: 請求無效
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    error:
                      type: string
                      example: 請提供username、e-mail和password
          409:
            description: 用戶名或郵箱已存在
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    error:
                      type: string
                      example: username或e-mail已被使用
          500:
            description: 服務器錯誤
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    error:
                      type: string
                      example: 註冊失敗
                    details:
                      type: string
                      example: 錯誤詳情信息
  `}
module.exports = {
    register
  };