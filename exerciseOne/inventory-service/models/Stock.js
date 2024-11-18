module.exports = (sequelize, DataTypes) => {
    const Stock = sequelize.define('Stock', {
        shop_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        plu: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id',
            },
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

    return Stock;
};
