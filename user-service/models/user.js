'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model { }
    User.init({
        name: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        paranoid: true,
    });
    return User;
};
