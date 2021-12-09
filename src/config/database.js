require("dotenv").config();

module.exports = {
  dialect: "postgres",
  host: process.env.DB_HOST,
  database: "labs",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  define: {
    timestamps: true,
    underscored: true,
  },
};
