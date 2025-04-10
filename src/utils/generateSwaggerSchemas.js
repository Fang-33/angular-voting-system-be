// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const { getDMMF } = require('@prisma/sdk');
// const path = require('path');

// const generateSwaggerSchemas = async () => {
//     // 加載 Prisma schema 文件
//     const prismaSchemaPath = path.join(__dirname, '../../prisma/schema.prisma');
//     const dmmf = await getDMMF({ datamodelPath: prismaSchemaPath });
  
//     const schemas = {};
  
//     // 遍歷模型並生成 Swagger 模型
//     dmmf.datamodel.models.forEach((model) => {
//       schemas[model.name] = {
//         type: 'object',
//         properties: model.fields.reduce((acc, field) => {
//           // 根據字段類型映射 Swagger 類型
//           let fieldType;
//           switch (field.type) {
//             case 'String':
//               fieldType = 'string';
//               break;
//             case 'Int':
//               fieldType = 'integer';
//               break;
//             case 'DateTime':
//               fieldType = 'string';
//               format: 'date-time';
//               break;
//             case 'Boolean':
//               fieldType = 'boolean';
//               break;
//             default:
//               fieldType = 'string';
//           }
  
//           acc[field.name] = {
//             type: fieldType,
//             example: field.name === 'id' ? '550e8400-e29b-41d4-a716-446655440000' : field.name, // 示例值
//           };
//           return acc;
//         }, {}),
//       };
//     });
//     return schemas;
//   };

// module.exports = generateSwaggerSchemas;