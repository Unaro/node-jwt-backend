import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    //reportCardId: {type: DataTypes.INTEGER, unique: true},
    reportCard: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false}
})

const Activity = sequelize.define('activity', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW}
})

const TypesOfActivity = sequelize.define('typesActivities', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

User.hasMany(Activity)
Activity.belongsTo(User)

Activity.hasOne(TypesOfActivity)
TypesOfActivity.belongsTo(Activity)

const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refreshToken: {type: DataTypes.STRING, allowNull: false}
})

User.hasOne(Token)
Token.belongsTo(User)

const Role = sequelize.define('role', {
    name: {type: DataTypes.STRING, allowNull: false},
    roleRaiting: {type: DataTypes.INTEGER, allowNull: false}
})

User.hasOne(Role)
Role.belongsTo(User)

export default {
    User, 
    Activity, 
    TypesOfActivity,
    Token,
    Role
}