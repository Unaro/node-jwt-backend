import ApiError from "../error/ApiError.js"
import activityModel from "../models/activity-model.js"
const {Activity, TypesOfActivity, Comments, SportType} = activityModel
import userModel from "../models/user-model.js"
const {User} = userModel

class ActivityService {
    
    async createActivity(planeDate, activitiesTypeId, sportTypeId, userId) {
        const activity = await Activity.create({ 
                planeDate, 
                activitiesTypeId, 
                sportTypeId, 
                userId 
            })
        return activity
    }
    
    //написано переводчиком а не программистом 
    async deleteActivity(activity){
        if(!activity) throw ApiError.DoesNotExist
        await activity.destroy()
        return {message: "Удалено"}
    }

    async createTypeActivity(name, scores) {
        if (!name) throw ApiError.DoesNotExist
        
        const activityType = await TypesOfActivity.create({
            name, scores
        })
        return activityType
    }
    //написано переводчиком а не программистом 
    async deleteTypeActivity(activityType){
        if(!activityType) throw ApiError.DoesNotExist
        await activityType.destroy()
        return {message: "Удалено"}
    }
    
    //не знаю надо ли
    async createTypeSport(name, scores){
        if(!name) throw ApiError.DoesNotExist
        const typeSport = await SportType.create({
            name, scores
        })
        return typeSport
    }
    async deleteTypeSport(typeSport){
        if(!typeSport) throw ApiError.DoesNotExist
        await typeSport.destroy()
        return {message: "Удалено"}
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