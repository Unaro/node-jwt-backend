import ApiError from "../error/ApiError.js"
import activityModel from "../models/activity-model.js"
const {Activity, TypesOfActivity, Comments, SportType} = activityModel
import userModel from "../models/user-model.js"
const {User} = userModel

class ActivityService {
    
    async createActivity(planeDate, activitiesTypeId, sportTypeId, userId) {
        const activity = await Activity.create({ planeDate, activitiesTypeId, sportTypeId, userId })
        return activity
    }

    async findTypeActivity(id) {
        
        const activityType = await TypesOfActivity.findByPk(id)
        if (!activityType) throw ApiError.DoesNotExist()
        
        return activityType
    }

    async findTypeSport(id) {
        
        const sportType = await SportType.findByPk(id)
        if (!sportType) throw ApiError.DoesNotExist()
        
        return sportType
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

export default new ActivityService