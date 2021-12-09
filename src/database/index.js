const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const Lab = require("../models/Lab");
const Exam = require("../models/Exam");

const connection = new Sequelize(dbConfig);

Lab.init(connection);
Exam.init(connection);

module.exports = connection;
