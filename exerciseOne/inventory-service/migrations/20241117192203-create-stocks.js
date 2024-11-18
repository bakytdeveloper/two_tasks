// /inventory-service/migrations/20231118000000-create-stock.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Stocks', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            shop_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            plu: {
                type: Sequelize.STRING,
                allowNull: false,

            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Products',
                    key: 'id',
                },
                onDelete: 'CASCADE', // При удалении продукта удаляются и остатки
            },
            stock_quantity: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            order_quantity: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Stocks');
    },
};
