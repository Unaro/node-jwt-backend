import sequelize from '../db.js'
import { DataTypes, NOW } from 'sequelize'

const Comments = sequelize.define('comments', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    message: {type: DataTypes.STRING, allowNull: false}
})

const Activity = sequelize.define('activity', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    plan_date: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
})

const TypesOfActivity = sequelize.define('activities_type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const SportType = sequelize.define('sport_types', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

TypesOfActivity.hasMany(Activity)
Activity.belongsTo(TypesOfActivity)

export default { 
    Activity, TypesOfActivity, Comments, SportType
}