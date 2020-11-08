const sequelize = require('../database')
var DataTypes = require('sequelize/lib/data-types');
const User = sequelize.define('User', {
  // Model attributes are defined here
  UserId: {
  type: DataTypes.UUID,
  defaultValue: sequelize.UUIDV4,
  primaryKey: true,
  // Or Sequelize.UUIDV1
  allowNull:false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
  },
  Mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  }
  //freezeTableName: true
},{freezeTableName: true});

async () => {
  await User.sync()
}

module.exports = User;