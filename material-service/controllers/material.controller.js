const Sequelize = require('sequelize');
const { sequelize } = require('../models');
const Material = require('../models/material')(sequelize, Sequelize.DataTypes);

exports.findAllMaterials = async (req, res) => {
    try {
        const materials = await Material.findAll();
        res.json({
            error: true,
            message: 'Materials list',
            data: materials
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

exports.createMaterial = async (req, res) => {
    try {
        const material = await Material.create(req.body);
        res.json({
            error: false,
            message: 'Material created',
            data: material
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

exports.findMaterial = async (req, res) => {
    const material = await Material.findByPk(req.params.id);

    if (!material) {
        res.status(404).json({
            'error': true,
            'message': 'Material not found'
        });
    }

    res.json({
        'error': false,
        'message': 'Material details',
        'data': material
    });
};

exports.updateMaterial = async (req, res) => {
    try {
        const material = await Material.findByPk(req.params.id);
        if (!material) {
            return res.status(404).json({
                error: true,
                message: 'Material not found'
            });
        }
        await material.update(req.body);
        res.json({
            error: false,
            message: 'Material updated',
            data: material
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
}

exports.deleteMaterial = async (req, res) => {
    const material = await Material.findByPk(req.params.id);
    if (!material) {
        res.status(404).json({
            'error': true,
            'message': 'Material not found'
        });
    }

    await material.destroy();

    res.json({
        'error': false,
        'message': 'Material deleted'
    });
}