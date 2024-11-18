module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product", {
        shop_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        plu: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        stock_quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        order_quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        timestamps: false,
    });

    return Product;
};
