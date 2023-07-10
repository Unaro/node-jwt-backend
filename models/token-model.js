import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refreshToken: {type: DataTypes.STRING, allowNull: false}
})

export default { 
    Token
}