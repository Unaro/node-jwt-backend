import sequelize from '../db.js'
import userModel from "./user-model.js"
import tokenModel from "./token-model.js"
import activityModel from "./activity-model.js"
import achievmentsModel from './achivments-model.js'

const UserSport = sequelize.define('user_sport', {}, { timestamps: false });

userModel.User.hasMany(activityModel.Activity)
activityModel.Activity.belongsTo(userModel.User)

activityModel.Activity.hasMany(userModel.Scores)
userModel.Scores.belongsTo(activityModel.Activity)

userModel.User.belongsToMany(activityModel.SportType, { through: UserSport })
activityModel.SportType.belongsToMany(userModel.User, { through: UserSport })

achievmentsModel.Params.hasMany(userModel.UserStatistic)
userModel.UserStatistic.belongsTo(achievmentsModel.Params)

achievmentsModel.Achievements.hasMany(userModel.UserAchievments)
userModel.UserAchievments.belongsTo(achievmentsModel.Achievements)

//userModel.User.belongsToMany(achivmentsModel.Achievements, { through: AchievementUser })
//achivmentsModel.Achievements.belongsToMany(userModel.User, { through: AchievementUser })


// userModel.User.hasMany(activityModel.Comments)
// activityModel.Comments.belongsTo(userModel.User)

// activityModel.Activity.hasMany(activityModel.Comments)
// activityModel.Comments.belongsTo(activityModel.Activity)

userModel.User.hasOne(tokenModel.Token)
tokenModel.Token.belongsTo(userModel.User)

export default {userModel, tokenModel, activityModel}