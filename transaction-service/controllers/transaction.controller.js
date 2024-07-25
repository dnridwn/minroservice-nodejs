const Sequelize = require('sequelize');
const { sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { connectRabbitMQ, sendAndReceive } = require('../services/rabbitmq.service');
const Transaction = require('../models/transaction')(sequelize, Sequelize.DataTypes);

exports.findAllTransactions = async (req, res) => {
    const transactions = await Transaction.findAll();
    res.json({
        'error': false,
        'message': 'Transactions list',
        'data': transactions
    });
};

exports.createTransaction = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({
            'error': true,
            'message': result.array()[0].msg
        });    
    }

    const { vendor_id, customer_id, material_id } = req.body;

    const channel = await connectRabbitMQ();

    const { vendor, customer } = await sendAndReceive(channel, 'transaction_get_vendor_customer', { vendorID: vendor_id, customerID: customer_id });
    if (!vendor) {
        channel.close();
        return res.status(400).json({
            'error': true,
            'message': 'Vendor not found'
        });
    }

    if (!customer) {
        channel.close();
        return res.status(400).json({
            'error': true,
            'message': 'Customer not found'
        });
    }

    const { material } = await sendAndReceive(channel, 'transaction_get_material', { materialID: material_id });
    if (!material) {
        channel.close();
        return res.status(400).json({
            'error': true,
            'message': 'Material not found'
        });
    }

    channel.close();
    
    const transaction = await Transaction.create({
        vendor_id: vendor.id,
        vendor: vendor.name,
        customer_id: customer.id,
        customer: customer.name,
        material_id: material.id,
        material: material.name,
        transaction_date: new Date()
    });

    return res.json({
        'error': false,
        'message': 'Transaction created',
        'data': transaction
    });
};

exports.findTransaction = async (req, res) => {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction) {
        res.status(404).json({
            'error': true,
            'message': 'Transaction not found'
        });
    }

    res.json({
        'error': false,
        'message': 'Transaction details',
        'data': transaction
    });
};

exports.updateTransaction = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({
            'error': true,
            'message': result.array()[0].msg
        });    
    }

    const { vendor_id, customer_id, material_id } = req.body;

    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
        res.status(404).json({
            'error': true,
            'message': 'Transaction not found'
        });
    }

    const channel = await connectRabbitMQ();

    const { vendor, customer } = await sendAndReceive(channel, 'transaction_get_vendor_customer', { vendorID: vendor_id, customerID: customer_id });
    if (!vendor) {
        channel.close();
        return res.status(400).json({
            'error': true,
            'message': 'Vendor not found'
        });
    }

    if (!customer) {
        channel.close();
        return res.status(400).json({
            'error': true,
            'message': 'Customer not found'
        });
    }

    const { material } = await sendAndReceive(channel, 'transaction_get_material', { materialID: material_id });
    if (!material) {
        channel.close();
        return res.status(400).json({
            'error': true,
            'message': 'Material not found'
        });
    }

    channel.close();

    transaction.name = req.body.name;
    transaction.vendor_id = vendor.id;
    transaction.vendor = vendor.name;
    transaction.customer_id = customer.id;
    transaction.customer = customer.name;
    await transaction.save();

    res.json({
        'error': false,
        'message': 'Transaction updated',
        'data': transaction
    });
};

exports.deleteTransaction = async (req, res) => {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
        res.status(404).json({
            'error': true,
            'message': 'Transaction not found'
        });
    }

    await transaction.destroy();

    res.json({
        'error': false,
        'message': 'Transaction deleted'
    });
}
