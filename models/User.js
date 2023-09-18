const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing.
const sequelize = require('../config/connection');


// User class that extends Sequelize's Model class.
class User extends Model {
  // Method to check if the provided login password matches the stored hashed password.
    checkPassword(loginPW) {
        return bcrypt.compareSync(loginPW, this.password);
    }
}


User.init(
  
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6]  // Password must be at least 6 characters long.
      },
    },
  },

  {// Hooks to hash the password before creating a new user.
    hooks: {
      beforeCreate: async (newUserData) => {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
    },
  },
    sequelize,
    timestamps: false,
    freezeTableName: true, // Prevent sequelize from pluralizing the table name.
    underscored: true, // Use underscores in the table name instead of camelCase.
    modelName: 'user',
  }
);

module.exports = User;
