"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("exams_labs", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "exams", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      lab_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "labs", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("exams_labs");
  },
};
