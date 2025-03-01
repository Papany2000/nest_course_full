import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basename = path.basename(__filename);

async function loadModels(sequelize) {
  const db = {};

  const files = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  });

  for (const file of files) {
    const modulePath = path.join(__dirname, file);
    try {
      const { default: modelFactory } = await import(modulePath); // Динамический импорт
      const model = modelFactory(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    } catch (error) {
      console.error(`Ошибка при загрузке модели из файла ${file}:`, error);
      throw error; // Пробрасываем ошибку дальше, чтобы приложение не запустилось с неполным набором моделей
    }
  }

  return db;
}

export { loadModels }; // Экспортируем функцию загрузки моделей
