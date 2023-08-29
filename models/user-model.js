import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    //reportCardId: {type: DataTypes.INTEGER, unique: true},
    reportCard: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false}
})

const Scores = sequelize.define('scores', {
    amount: {type: DataTypes.INTEGER, allowNull: false}
})

const UserInfo = sequelize.define('user_info', {
    email: {type: DataTypes.STRING},
    firstname: {type: DataTypes.STRING},
    lastname: {type: DataTypes.STRING},
    patronymic: {type: DataTypes.STRING},
    height: {type: DataTypes.FLOAT},
    weight: {type: DataTypes.FLOAT}
}, { timestamps: false })

const Role = sequelize.define('role', {
    name: {type: DataTypes.STRING, allowNull: false},
    roleRaiting: {type: DataTypes.INTEGER, allowNull: false}
})

const Achievements = sequelize.define('data_achievements', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
})

const RoleUser = sequelize.define('role_user', {}, { timestamps: false });
const AchievementUser = sequelize.define('achievement_user');

User.hasMany(Scores)
Scores.belongsTo(User)

User.hasOne(UserInfo)
UserInfo.belongsTo(User)

User.belongsToMany(Achievements, { through: AchievementUser })
Achievements.belongsToMany(User, { through: AchievementUser })

User.belongsToMany(Role, { through: RoleUser })
Role.belongsToMany(User, { through: RoleUser })



export default {
    User,
    Role,
    Scores,
    UserInfo
}