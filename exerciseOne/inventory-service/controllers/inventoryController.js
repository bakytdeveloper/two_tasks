// /inventory-service/controllers/inventoryController.js
const axios = require("axios");
const { Product, Stock } = require('../models');
const { Op } = require('sequelize');
const historyServiceUrl = 'http://localhost:3003/api/history';

const inventoryController = {
    // createProduct: async (req, res) => {
    //     try {
    //         const { plu, name, shop_id, stock_quantity, order_quantity } = req.body;
    //         if (!plu || !name || !shop_id || !order_quantity) {
    //             return res.status(400).json({ message: 'Не все обязательные поля переданы' });
    //         }
    //
    //         const existingProduct = await Product.findOne({
    //             where: {
    //                 plu,
    //                 shop_id,
    //             },
    //         });
    //
    //         if (existingProduct) {
    //             return res.status(400).json({
    //                 message: `Товар с PLU ${plu} уже существует в магазине с ID ${shop_id}`,
    //             });
    //         }
    //
    //         const product = await Product.create({
    //             plu,
    //             name,
    //             shop_id,
    //             stock_quantity: stock_quantity || 0,
    //             order_quantity: order_quantity || 0,
    //         });
    //
    //         const stock = await Stock.create({
    //             plu,
    //             product_id: product.id,
    //             shop_id,
    //             stock_quantity: stock_quantity || 0,
    //             order_quantity: order_quantity || 0,
    //         });
    //
    //         const response = await axios.post(historyServiceUrl, {
    //             action: 'Создание товара и остатков',
    //             plu,
    //             name,
    //             shop_id,
    //             stock_quantity,
    //             created_at: new Date(),
    //         });
    //
    //         return res.status(201).json({ message: 'Товар и остатки успешно созданы', product, stock });
    //     } catch (error) {
    //         console.error('Ошибка при создании товара:', error);
    //         res.status(500).json({ message: 'Ошибка при создании товара', error: error.message });
    //     }
    // },

    createProduct: async (req, res) => {
        try {
            const { plu, name, shop_id, stock_quantity, order_quantity } = req.body;

            if (!plu || !name || !shop_id || !order_quantity) {
                return res.status(400).json({ message: 'Не все обязательные поля переданы' });
            }

            // Проверка на существование товара
            const existingProduct = await Product.findOne({
                where: { plu, shop_id },
            });

            if (existingProduct) {
                return res.status(400).json({
                    message: `Товар с PLU ${plu} уже существует в магазине с ID ${shop_id}`,
                });
            }

            // Создание товара
            const product = await Product.create({
                plu,
                name,
                shop_id,
                stock_quantity: stock_quantity || 0,
                order_quantity: order_quantity || 0,
            });

            // Создание связанного остатка
            await Stock.create({
                plu,
                product_id: product.id,
                shop_id,
                stock_quantity: stock_quantity || 0,
                order_quantity: order_quantity || 0,
            });

            // Отправка данных в сервис истории
            await axios.post(historyServiceUrl, {
                action: 'Создание товара и остатков',
                plu,
                name,
                shop_id,
                stock_quantity,
                created_at: new Date(),
            });

            // Возвращение только данных о товаре без остатков
            return res.status(201).json({
                message: 'Товар успешно создан',
                product,
            });
        } catch (error) {
            console.error('Ошибка при создании товара:', error);
            res.status(500).json({ message: 'Ошибка при создании товара', error: error.message });
        }
    },


    createStock: async (req, res) => {
        try {
            const { plu, stock_quantity, order_quantity, shop_id } = req.body;
            const product = await Product.findOne({ where: { plu, shop_id } });

            if (!product) {
                return res.status(404).json({ message: 'Товар не найден' });
            }

            const stock = await Stock.create({
                product_id: product.id,
                plu,
                shop_id,
                stock_quantity,
                order_quantity,
            });

            const response = await axios.post(historyServiceUrl, {
                action: 'Создание остатка товара',
                plu,
                name: product.name,
                shop_id,
                stock_quantity,
                created_at: new Date(),
            });


            res.status(200).json(stock);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при создании остатка', error });
        }
    },

    increaseStock: async (req, res) => {
        try {
            const { plu, stock_quantity, shop_id } = req.body;

            // Найти остаток по PLU и магазину, включая связанный продукт
            const stock = await Stock.findOne({
                where: { plu, shop_id },
                include: {
                    model: Product,
                    as: 'product'  // Указываем alias для Product
                }
            });

            // Проверяем, найден ли остаток
            if (!stock) {
                return res.status(404).json({ message: 'Остаток товара не найден' });
            }

            // Увеличиваем количество на складе
            stock.stock_quantity += stock_quantity;
            await stock.save();

            // Добавляем запись в историю
            const response = await axios.post(historyServiceUrl, {
                action: `Увеличение остатка на ${stock_quantity}`,
                plu,
                name: stock.product.name,  // Теперь доступно через 'product'
                shop_id,
                stock_quantity: stock.stock_quantity,
                created_at: new Date(),
            });


            // Убираем поле 'product' из возвращаемого объекта stock
            const { product, ...stockData } = stock.toJSON(); // Убираем 'product' из объекта

            res.status(200).json(stockData);  // Отправляем только нужные данные
        } catch (error) {
            console.error('Ошибка при увеличении остатка:', error); // Логирование ошибки
            res.status(500).json({ message: 'Ошибка при увеличении остатка', error: error.message || error });
        }
    },

    decreaseStock: async (req, res) => {
        try {
            const { plu, stock_quantity, shop_id } = req.body;
            const stock = await Stock.findOne({
                where: { plu, shop_id },
                include: {
                    model: Product,
                    as: 'product'
                }
            });

            if (!stock) {
                return res.status(404).json({ message: 'Остаток товара не найден' });
            }

            if (stock.stock_quantity - stock_quantity < 0) {
                return res.status(400).json({ message: 'Недостаточно остатков' });
            }

            stock.stock_quantity -= stock_quantity;
            await stock.save();

            const response = await axios.post(historyServiceUrl, {
                action: `Уменьшение остатка на ${stock_quantity}`,
                plu,
                name: stock.product.name,
                shop_id,
                stock_quantity: stock.stock_quantity,
                created_at: new Date(),
            });

            const { product, ...stockData } = stock.toJSON();


            res.status(200).json(stockData);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при уменьшении остатка', error });
        }
    },


    getInventory: async (req, res) => {
        try {
            const { plu, shop_id, min_stock, max_stock, min_order, max_order } = req.query;

            const query = {};
            if (plu) query.plu = plu;
            if (shop_id) query.shop_id = shop_id;

            if (min_stock || max_stock) {
                query.stock_quantity = {};
                if (min_stock) query.stock_quantity[Op.gte] = parseInt(min_stock);
                if (max_stock) query.stock_quantity[Op.lte] = parseInt(max_stock);
            }

            if (min_order || max_order) {
                query.order_quantity = {};
                if (min_order) query.order_quantity[Op.gte] = parseInt(min_order);
                if (max_order) query.order_quantity[Op.lte] = parseInt(max_order);
            }

            // Получаем данные с вложенными product
            const stocks = await Stock.findAll({
                where: query,
                include: [{
                    model: Product,
                    as: 'product',
                }],
            });

            // Преобразуем результат, убирая поле 'product'
            const stocksWithoutProduct = stocks.map(stock => {
                const { product, ...stockData } = stock.toJSON(); // Извлекаем и исключаем 'product'
                return stockData;
            });

            // Отправляем результат без вложенных объектов 'product'
            res.status(200).json(stocksWithoutProduct);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении остатков', error });
        }
    },

    // Получение товаров по фильтрам
    getProducts: async (req, res) => {
        try {
            const { name, plu } = req.query;

            if (!name && !plu) {
                return res.status(400).json({ message: "Не указан параметр для фильтрации" });
            }

            const query = {};

            if (name) {
                query.name = { [Op.like]: `%${name}%` };
            }
            if (plu) {
                query.plu = plu;
            }

            const products = await Product.findAll({
                where: query,
                include: [{
                    model: Stock,
                    as: 'stocks',
                    attributes: []
                }],
                attributes: { exclude: ['stocks'] }
            });

            res.status(200).json(products);
        } catch (error) {
            console.error("Ошибка при получении товаров:", error);
            res.status(500).json({ message: "Ошибка при получении товаров", error });
        }
    }
};

module.exports = inventoryController;
