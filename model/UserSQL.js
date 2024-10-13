const { Sequelize, DataTypes, Model } = require('@sequelize/core');
const sequelize = require('../config/dbConn');  
const { v4: uuidv4 } = require('uuid');

class User extends Model {}

User.init({
    userId: {
        type: DataTypes.UUID,  
        defaultValue: () => uuidv4(),  
        allowNull: false,  
        primaryKey: true  
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,  
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false  
    },
    roles: {
        type: DataTypes.JSON, 
        allowNull: false,
        defaultValue: 2001
    },
    refreshToken: {
        type: DataTypes.STRING,  
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',  
    timestamps: true  
});

module.exports = User;
