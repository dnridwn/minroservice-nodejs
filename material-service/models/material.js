'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Material extends Model { }
    Material.init({
        name: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Material',
        tableName: 'materials',
        paranoid: true
    });
    return Material;
};