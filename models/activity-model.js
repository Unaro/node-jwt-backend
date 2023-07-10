import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

const Comments = sequelize.define('comments', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    message: {type: DataTypes.STRING, allowNull: false}
})

const Activity = sequelize.define('activity', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const TypesOfActivity = sequelize.define('typesActivities', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

Activity.hasOne(TypesOfActivity)
TypesOfActivity.belongsTo(Activity)

export default { 
    Activity, TypesOfActivity, Comments
}