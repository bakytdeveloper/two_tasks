// /inventory-service/migrations
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Products", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            shop_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            plu: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
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

    down: async (queryInterface) => {
        await queryInterface.dropTable("Products");
    },
};
