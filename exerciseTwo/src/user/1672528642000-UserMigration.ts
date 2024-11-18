import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserMigration1672528642000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Создание таблицы "user"
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "firstname" VARCHAR(255),
                "lastname" VARCHAR(255),
                "age" INT,
                "gender" VARCHAR(50),
                "problem" BOOLEAN
            );
        `);

        // Вставка данных
        await queryRunner.query(`
            INSERT INTO "user" (firstname, lastname, age, gender, problem)
            SELECT
                'First' || i,
                'Last' || i,
                (random() * 60 + 18)::int,
                CASE WHEN random() < 0.5 THEN 'male' ELSE 'female' END,
                random() < 0.3
            FROM generate_series(1, 1000000) AS i;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user";`);
    }
}
