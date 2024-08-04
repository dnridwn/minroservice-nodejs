const Sequelize = require('sequelize');
const { sequelize } = require('../models');
const User = require('../models/user')(sequelize, Sequelize.DataTypes);

exports.transactionGetVendorCustomerRequestListener = async function(channel, msg) {
    channel.ack(msg);

    const { sessionID, vendorID, customerID } = JSON.parse(msg.content.toString());
    const response = {
        sessionID,
        vendor: null,
        customer: null
    }

    try {
        const vendor = await User.findByPk(vendorID);
        response.vendor = vendor;
    } catch (error) {
        console.error(error);
    }

    try {
        const customer = await User.findByPk(customerID);
        response.customer = customer;
    } catch (error) {
        console.error(error);
    }

    channel.sendToQueue('transaction_get_vendor_customer_response', Buffer.from(JSON.stringify(response)));
}
