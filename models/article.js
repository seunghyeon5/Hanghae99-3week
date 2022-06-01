'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  article.init({
    articleId: { //프라이머리키
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    Password: DataTypes.STRING,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    Date: DataTypes.DATE,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'article',
  });
  return Article;
};