const Sequelize = require('sequelize');
const { sequelize } = require('../models');
const { validationResult } = require('express-validator');
const User = require('../models/user')(sequelize, Sequelize.DataTypes);

exports.findAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        
        res.json({
            'error': false,
            'message': 'Users list',
            'data': users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            'error': true,
            'message': 'An error has occurred'
        });
    }
};

exports.createUser = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({
            'error': true,
            'message': result.array()[0].msg
        });    
    }

    const user = await User.create({
        name: req.body.name
    });

    res.json({
        'error': false,
        'message': 'User created',
        'data': user
    });
};

exports.findUser = async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        res.status(404).json({
            'error': true,
            'message': 'User not found'
        });
    }

    res.json({
        'error': false,
        'message': 'User details',
        'data': user
    });
};

exports.updateUser = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({
            'error': true,
            'message': result.array()[0].msg
        });    
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
        res.status(404).json({
            'error': true,
            'message': 'User not found'
        });
    }

    user.name = req.body.name;
    await user.save();

    res.json({
        'error': false,
        'message': 'User updated',
        'data': user
    });
};

exports.deleteUser = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
        res.status(404).json({
            'error': true,
            'message': 'User not found'
        });
    }

    await user.destroy();

    res.json({
        'error': false,
        'message': 'User deleted'
    });
}