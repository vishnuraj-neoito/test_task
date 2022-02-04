import { Sequelize } from 'sequelize';

const { DB_USERNAME, DB_HOST, DB_NAME, DB_PASSWORD } = process.env;

const sequelize = new Sequelize(DB_NAME as string, DB_USERNAME as string, DB_PASSWORD as string, {
    host: DB_HOST as string,
    dialect: 'postgres',
    logging: false,
    timezone: 'utc'
});

export default sequelize;
