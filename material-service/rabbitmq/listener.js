const Sequelize = require('sequelize');
const { sequelize } = require('../models');
const Material = require('../models/material')(sequelize, Sequelize.DataTypes);

exports.transactionGetMaterialRequestListener = async function(channel, msg) {
    channel.ack(msg);

    const { sessionID, materialID } = JSON.parse(msg.content.toString());
    const response = {
        sessionID,
        material: null
    }

    try {
        const material = await Material.findByPk(materialID);
        response.material = material;
    } catch (error) {
        console.error(error);
    }

    channel.sendToQueue('transaction_get_material_response', Buffer.from(JSON.stringify(response)));
}
