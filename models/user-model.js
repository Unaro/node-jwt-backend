import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    //reportCardId: {type: DataTypes.INTEGER, unique: true},
    reportCard: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false}
})

const UserInfo = sequelize.define('user_info', {
    firstname: {type: DataTypes.STRING, allowNull: true},
    lastname: {type: DataTypes.STRING, allowNull: true},
    patronymic: {type: DataTypes.STRING, allowNull: true}
}, { timestamps: false })

const Role = sequelize.define('role', {
    name: {type: DataTypes.STRING, allowNull: false},
    roleRaiting: {type: DataTypes.INTEGER, allowNull: false}
})

const Role_User = sequelize.define('role_user', {}, { timestamps: false });

User.hasOne(UserInfo)
UserInfo.belongsTo(User)

User.belongsToMany(Role, { through: Role_User })
Role.belongsToMany(User, { through: Role_User })



export default {
    User,
    Role,
    UserInfo
}