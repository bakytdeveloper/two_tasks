// history-service/server.ts
import express from 'express';
import bodyParser from 'body-parser';
import historyRoutes from './routes/historyRoutes';

import config from './config/config';
import {Sequelize} from "sequelize";

const sequelize = new Sequelize(config.development);

const app = express();
const PORT = process.env.PORT || 3003;

app.use(bodyParser.json());
app.use('/api', historyRoutes);

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Сервер истории товара запущен на ${PORT} порту`));
});
