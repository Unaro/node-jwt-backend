import sequelize from '../db.js'
import { DataTypes } from 'sequelize'


const Achievements = sequelize.define('achievements', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
})

const AchievmentParams = sequelize.define('achievment_params', {
    target: {type: DataTypes.INTEGER, defaultValue: 0}
})

const Params = sequelize.define('params', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false},
    targetName: {type: DataTypes.STRING}
})

Achievements.hasMany(AchievmentParams)
AchievmentParams.belongsTo(Achievements)

Params.hasMany(AchievmentParams)
AchievmentParams.belongsTo(Params)

export default {
    Achievements,
    AchievmentParams,
    Params
}