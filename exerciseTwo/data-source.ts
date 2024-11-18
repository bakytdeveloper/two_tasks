import { DataSource } from 'typeorm';
import { User } from './src/user/user.entity';
import { UserMigration1672528642000 } from './src/user/1672528642000-UserMigration';

import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    migrations: [UserMigration1672528642000],
    synchronize: false,
    logging: true,
});
