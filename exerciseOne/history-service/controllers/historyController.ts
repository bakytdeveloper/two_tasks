import { Request, Response, RequestHandler } from 'express';
import { History } from '../models/History';
import {Op} from "sequelize";

export const historyController = {
    // Создание записи в истории
    createHistory: (async (req: Request, res: Response) => {
        try {
            const { action, name, plu, shop_id, stock_quantity } = req.body;

            if (!action || !plu || !shop_id) {
                return res.status(400).json({ message: 'Обязательные поля не переданы' });
            }

            const history = await History.create({
                action,
                name,
                plu,
                shop_id,
                stock_quantity,
                date: new Date(),
            });

            res.status(201).json({ message: 'Запись в истории успешно создана', history });
        } catch (error) {
            console.error('Ошибка создания записи:', error);
            res.status(500).json({ message: 'Ошибка создания записи', error: (error as Error).message });
        }
    }) as RequestHandler,

    getHistory: (async (req: Request, res: Response) => {
        try {
            const { shop_id, plu, start_date, end_date, action, page = 1, limit = 10 } = req.query;

            // Объект запроса для фильтрации
            const query: any = {};

            if (shop_id) query.shop_id = shop_id;
            if (plu) query.plu = plu;

            // Если action передан, ищем подстроку в поле action
            if (action) {
                query.action = {
                    [Op.like]: `%${action}%`,  // Ищем подстроку в поле action
                };
            }

            if (start_date && end_date) {
                const startDate = new Date(start_date as string);
                const endDate = new Date(end_date as string);

                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    return res.status(400).json({ message: 'Неверный формат дат' });
                }

                query.date = {
                    [Op.gte]: startDate,  // >=
                    [Op.lte]: endDate,    // <=
                };
            }

            const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

            const historyRecords = await History.findAndCountAll({
                where: query,
                offset,
                limit: parseInt(limit as string),
                order: [['date', 'DESC']],
            });

            res.status(200).json({
                records: historyRecords.rows,
                totalRecords: historyRecords.count,
                totalPages: Math.ceil(historyRecords.count / parseInt(limit as string)),
                currentPage: page,
            });
        } catch (error) {
            console.error('Ошибка получения истории:', error);
            res.status(500).json({ message: 'Ошибка получения истории', error: (error as Error).message });
        }
    }) as RequestHandler,

};