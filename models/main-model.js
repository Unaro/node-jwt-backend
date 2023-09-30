import sequelize from '../db.js'
import userModel from "./user-model.js"
import tokenModel from "./token-model.js"
import activityModel from "./activity-model.js"

userModel.User.hasMany(activityModel.Activity)
activityModel.Activity.belongsTo(userModel.User)

activityModel.Activity.hasMany(userModel.Scores)
userModel.Scores.belongsTo(activityModel.Activity)

const UserSport = sequelize.define('user_sport', {}, { timestamps: false });

userModel.User.belongsToMany(activityModel.SportType, { through: UserSport })
activityModel.SportType.belongsToMany(userModel.User, { through: UserSport })

// userModel.User.hasMany(activityModel.Comments)
// activityModel.Comments.belongsTo(userModel.User)

// activityModel.Activity.hasMany(activityModel.Comments)
// activityModel.Comments.belongsTo(activityModel.Activity)

userModel.User.hasOne(tokenModel.Token)
tokenModel.Token.belongsTo(userModel.User)

export default {userModel, tokenModel, activityModel}