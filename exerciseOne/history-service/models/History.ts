import { Sequelize, Model, DataTypes } from 'sequelize';
import config from '../config/config';

const sequelize = new Sequelize(config.development);

export class History extends Model {
    public id!: number;
    public action!: string;
    public plu!: string;
    public shop_id!: string;
    public stock_quantity!: number;
    public date!: Date;
}

History.init(
    {
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        plu: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        shop_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        stock_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        timestamps: false, // Отключаем создание полей createdAt и updatedAt
        tableName: 'History',
    }
);
