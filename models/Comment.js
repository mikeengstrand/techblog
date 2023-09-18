const { Model, DataTypes } = require('sequelize');  
const sequelize = require('../config/config');  


class Comment extends Model {}  // Define a Comment class that extends Sequelize's Model.
// Initialize the Comment model with specified attributes and options.
Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull : false,
            references: {
                model: 'user',  // Reference to the 'user' model.
                key: 'id',  // Reference to the 'id' attribute in the 'user' model.
            },
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull : false,
            references: {
                model: 'post',  // Reference to the 'post' model.
                key: 'id',  // Reference to the 'id' attribute in the 'post' model.
            },
        },
    },
    {
        sequelize, 
        freezeTableName: true,  // Prevent sequelize from pluralizing the table name.
        underscored: true,  // Use underscores in the table name instead of camelCase.
        modelName: 'comment',
    }
);


module.exports = Comment;