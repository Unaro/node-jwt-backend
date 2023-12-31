import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    logging: false,
    host: process.env.DB_URL,
    dialect: 'postgres',
})

export default sequelize