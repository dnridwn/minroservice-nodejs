'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('transactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            vendor_id: {
                type: Sequelize.INTEGER
            },
            vendor: {
                type: Sequelize.STRING
            },
            customer_id: {
                type: Sequelize.INTEGER
            },
            customer: {
                type: Sequelize.STRING
            },
            material_id: {
                type: Sequelize.INTEGER
            },
            material: {
                type: Sequelize.STRING
            },
            transaction_date: {
                type: Sequelize.DATE
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('transactions');
    }
};