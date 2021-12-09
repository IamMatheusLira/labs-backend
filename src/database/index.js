const Sequelize = require("sequelize");
const dbConfig = require("../config/database");
const Lab = require("../models/Lab");

const connection = new Sequelize(dbConfig);

Lab.init(connection);

module.exports = connection;
