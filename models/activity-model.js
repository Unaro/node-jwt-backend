import sequelize from '../db.js'
import { DataTypes, NOW } from 'sequelize'

// const Comments = sequelize.define('comments', {
//     id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
//     message: {type: DataTypes.STRING, allowNull: false}
// })

const Activity = sequelize.define('activity', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    plan_date: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    timeline: {type: DataTypes.INTEGER, defaultValue: 0},
})

const TypesOfActivity = sequelize.define('activities_type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    scores: {type: DataTypes.INTEGER, defaultValue: 0}
})

const SportType = sequelize.define('sport_types', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    scores: {type: DataTypes.DOUBLE, defaultValue: 1}
})

TypesOfActivity.hasMany(Activity)
Activity.belongsTo(TypesOfActivity)

SportType.hasMany(Activity)
Activity.belongsTo(SportType)

export default { 
    Activity, TypesOfActivity, SportType
}