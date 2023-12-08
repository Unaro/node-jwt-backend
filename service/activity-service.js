import ApiError from "../error/ApiError.js"
import activityModel from "../models/activity-model.js"
import statisticEventEmmiter from "./event_handlers/statisticEventEmmiter.js"
import statisticService from "./statistic-service.js"
import { Op } from "sequelize"
const _atributes = {
    plan_date: "plan_date", 
    timeline: "timeline",
    activitiesTypeId: "activitiesTypeId", 
    sportTypeId: "sportTypeId", 
    userId: "userId",
    id: "id",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    typeActivity: {
        name: "name",
        scores: "scores"
    }
}


const {Activity, TypesOfActivity, SportType} = activityModel

class ActivityService {

    //Создание
    async createActivity(plan_date, timeline, activitiesTypeId, sportTypeId, userId) {
        if (timeline < 0) throw ApiError.DoesNotExist()
        
        const activity = await Activity.create({ 
                plan_date, 
                timeline,
                activitiesTypeId, 
                sportTypeId, 
                userId 
            })
        const statistic = await statisticService.findParam("createActivity")
        if (statistic) {
            statisticEventEmmiter.PushStatistic(
                userId, 
                {
                    id: statistic.id, 
                    plan_date, 
                    sportTypeId, 
                    activitiesTypeId
                }, 
                1
            )
        }
        
        
        return activity
    }
    
    async createTypeActivity(name, scores) {
        if (!name) throw ApiError.DoesNotExist()
        
        const activityType = await TypesOfActivity.create({
            name, scores
        })
        return activityType
    }

    async createTypeSport(name, scores){
        if(!name) throw ApiError.DoesNotExist()
        scores = +scores
        const typeSport = await SportType.create({
            name, scores
        })
        return typeSport
    }
    
    //Удаление
    async deleteActivity(activity){
        if(!activity) throw ApiError.DoesNotExist()
        await activity.destroy()
        return {message: "Активность удалена!"}
    }
    
    async deleteTypeActivity(activityType){
        if(!activityType) throw ApiError.DoesNotExist()
        await activityType.destroy()
        return {message: "Тип активности удален!"}
    }

    async deleteTypeSport(typeSport){
        if(!typeSport) throw ApiError.DoesNotExist()
        await typeSport.destroy()
        return {message: "Спорт удален!"}
    }
    
    async deleteAllUserActivity(userId) {
        if (!userId) throw ApiError.EmptyRequest()

        await Activity.destroy({where: userId})
        return {message: "Активности успешно удалены!"}
    }
    
    //Обновление
    async updateActivity(newInfo, activity){
        if (!newInfo || !activity) throw ApiError.EmptyRequest()
        await activity.update(newInfo)

        return {message: "Данные обновлены!"}
    }

    async updateTypeActivity(newInfo, activityType){
        if (!newInfo) throw ApiError.EmptyRequest()
        await activityType.update(newInfo)
        return {message: "Данные обновлены!"}
    }

    async updateTypeSport(newInfo, sportType){
        if (!newInfo) throw ApiError.EmptyRequest()
        await sportType.update(newInfo)
        return {message: "Данные обновлены!"}
    }

    //Поиск
    async findAllTypesActivity() {
        
        const activityTypes = await TypesOfActivity.findAll()
        if (!activityTypes) throw ApiError.DoesNotExist()
        
        return activityTypes
    }

    async findAllTypesSport() {
        
        const sportTypes = await SportType.findAll()
        if (!sportTypes) throw ApiError.DoesNotExist()
        
        return sportTypes
    }

    async findAllActivites(params, mode = 0) {
        if (!params) throw ApiError.DoesNotExist()
        const activities = Activity.findAll({where: { plan_date: {[Op.gte]: params.dateFrom, [Op.lte]: params.dateTo}, userId: params.userId}})
        if (!activities && mode != 1) throw ApiError.DoesNotExist()
        return activities
    }

    async findUserActivity(userId, query) {
        const listActivity = Activity.findAndCountAll({
            where: {userId, ...query},
            include: {model: TypesOfActivity}
        })
        if (!listActivity) throw ApiError.DoesNotExist()
        return listActivity
    }
    
    async findTypeActivity(id) {
        
        const activityType = await TypesOfActivity.findByPk(id)
        if (!activityType) throw ApiError.DoesNotExist()
        
        return activityType
    }

    async findTypeSport(sportTypeId) {
        
        const sportType = await SportType.findByPk(sportTypeId, { include: Activity })
        if (!sportType) throw ApiError.DoesNotExist()
        
        sportType.get()

        return sportType
    }

    async findTypeSportActivities(typeSport) {
        
        const activities = await typeSport.findActivity(id)
        if (!activities) throw ApiError.DoesNotExist()
        
        return activities
    }
    
    async findActivity(activityId) {
        var num = Number.parseInt(activityId)
        if (!num) throw ApiError.DoesNotExist()
        const activity = Activity.findByPk(num, 
            {include: [
                {model: TypesOfActivity, attributes: [_atributes.typeActivity.name, _atributes.typeActivity.scores]}, 
                {model: SportType, attributes: [_atributes.typeActivity.name, _atributes.typeActivity.scores]}
            ], 
            attributes: [_atributes.id, _atributes.plan_date, _atributes.timeline, _atributes.createdAt, _atributes.updatedAt]})
        return activity
    }

}

export default new ActivityService()