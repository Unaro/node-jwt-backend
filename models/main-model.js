import userModel from "./user-model.js"
import tokenModel from "./token-model.js"
import activityModel from "./activity-model.js"

userModel.User.hasMany(activityModel.Activity)
activityModel.Activity.belongsTo(userModel.User)

userModel.User.hasMany(activityModel.Comments)
activityModel.Comments.belongsTo(userModel.User)

activityModel.Activity.hasMany(activityModel.Comments)
activityModel.Comments.belongsTo(activityModel.Activity)

userModel.User.hasOne(tokenModel.Token)
tokenModel.Token.belongsTo(userModel.User)

export default {userModel, tokenModel, activityModel}