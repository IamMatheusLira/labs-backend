const { DataTypes, Model } = require("sequelize");

class Lab extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        status: DataTypes.ENUM("active", "inactive"),
      },
      {
        sequelize,
      }
    );
  }
}

module.exports = Lab;
