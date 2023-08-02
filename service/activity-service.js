import ApiError from "../error/ApiError.js"
import activityModel from "../models/activity-model.js"
const {Activity, TypesOfActivity, Comments} = activityModel
import userModel from "../models/user-model.js"
const {User} = userModel

class ActivityService {
    async createActivity(body) {
        
    }

    async findActivity(activityId) {
        const activity = Activity.findByPk(activityId)
        if (!activity) throw ApiError.DoesNotExist()
        return activity
    }

    async findUserActivity(userId, query) {
        const listActivity = Activity.findAndCountAll({
            where: {userId},
            include: [{model: TypesOfActivity}, {model: Comments}]
        })
        if (!listActivity) throw ApiError.DoesNotExist()
        return listActivity
    }
}

export default ActivityService