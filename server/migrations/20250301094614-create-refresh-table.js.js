// server/migrations/<timestamp>-create-refresh-table.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('refresh_tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Имя таблицы, на которую ссылаемся
          key: 'id', // Имя столбца, на который ссылаемся
        },
        onUpdate: 'CASCADE', // Что делать при обновлении userId в таблице users
        onDelete: 'CASCADE', // Что делать при удалении пользователя из таблицы users
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Каждый refresh token должен быть уникальным
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false, // Должно быть указано время истечения
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('refresh');
  },
};
