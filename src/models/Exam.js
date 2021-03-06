const { DataTypes, Model } = require("sequelize");

class Exam extends Model {
  static init(sequelize) {
    super.init(
      {
        name: { type: DataTypes.STRING, unique: true },
        type: DataTypes.ENUM("clinicalAnalysis", "image"),
        status: DataTypes.ENUM("active", "inactive"),
      },
      {
        sequelize,
      }
    );
  }
}

module.exports = Exam;
