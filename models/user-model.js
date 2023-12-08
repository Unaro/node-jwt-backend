import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true, allowNull: false}, //reportCard
    email: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING, allowNull: false}
})

const UserInfo = sequelize.define('user_info', {
    firstname: {type: DataTypes.STRING},
    lastname: {type: DataTypes.STRING},
    patronymic: {type: DataTypes.STRING},
    height: {type: DataTypes.FLOAT},
}, {timestamps: false})

const UserStatistic = sequelize.define('statistic', {
    amount: {type: DataTypes.INTEGER, defaultValue: 0}
})

const UserAchievments = sequelize.define('user_achievments')

const IMT = sequelize.define('user_imt', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    weight: {type: DataTypes.FLOAT}
})

const Scores = sequelize.define('scores', {
    amount: {type: DataTypes.INTEGER, allowNull: false}
})

const Role = sequelize.define('role', {
    name: {type: DataTypes.STRING, allowNull: false},
    roleRaiting: {type: DataTypes.INTEGER, allowNull: false}
}, {timestamps: false})

const RoleUser = sequelize.define('role_user', {}, { timestamps: false });

User.hasMany(UserStatistic)
UserStatistic.belongsTo(User)

User.hasMany(Scores)
Scores.belongsTo(User)

User.hasOne(UserInfo)
UserInfo.belongsTo(User)

User.hasMany(IMT)
IMT.belongsTo(User)

User.hasMany(UserAchievments)
UserAchievments.belongsTo(User)

User.belongsToMany(Role, { through: RoleUser })
Role.belongsToMany(User, { through: RoleUser })



export default {
    User,
    Role,
    Scores,
    UserStatistic,
    UserAchievments,
    RoleUser,
    IMT
}