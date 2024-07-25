'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Transaction extends Model { }
    Transaction.init({
        vendor_id: DataTypes.INTEGER,
        vendor: DataTypes.STRING,
        customer_id: DataTypes.INTEGER,
        customer: DataTypes.STRING,
        material_id: DataTypes.INTEGER,
        material: DataTypes.STRING,
        transaction_date: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Transaction',
        tableName: 'transactions',
        paranoid: true
    });
    return Transaction;
};
