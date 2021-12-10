const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const Lab = require("../models/Lab");
const Exam = require("../models/Exam");

const connection = new Sequelize(dbConfig);

Lab.init(connection);
Exam.init(connection);

Lab.belongsToMany(Exam, {
  through: "exams_labs",
  as: "exams",
  foreignKey: "lab_id",
});

Exam.belongsToMany(Lab, {
  through: "exams_labs",
  as: "labs",
  foreignKey: "exam_id",
});

module.exports = connection;
