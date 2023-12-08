import ApiError from "../error/ApiError.js"
import activityService from "../service/activity-service.js"
import statisticEventEmmiter from "../service/event_handlers/statisticEventEmmiter.js"
import statisticService from "../service/statistic-service.js"
import userService from "../service/user-service.js"

class ActivityController {
    
    async create(req, res, next) {
        const {planeDate, timeline, activitiesTypeId, sportTypeId, userId} = req.body
        try {
            await userService.getUserByPk(userId)
            await activityService.findTypeActivity(activitiesTypeId)
            await activityService.findTypeSport(sportTypeId)

            const activity = await activityService.createActivity(planeDate, timeline, activitiesTypeId, sportTypeId, userId)
            return res.status(201).json(activity)
        } catch(e) {
            next(e)
        }
    }

    async createTypeActivity(req, res, next) {
        const {name, scores} = req.body
        try {
            const typeActivity = await activityService.createTypeActivity(name, scores)
            return res.status(201).json(typeActivity)
        } catch (e) {
            next(e)
        }
       
    }

    async createTypeSport(req, res, next) {
        const {name, scores} = req.body
        try {
            const typeSport = await activityService.createTypeSport(name, scores)
            return res.status(201).json(typeSport)
        } catch (e) {
            next(e)
        }
       
    }


    async deleteActivity(req, res, next) {
        const {activityId} = req.params
        try {
            const activity = await activityService.findActivity(activityId)
            const message = await activityService.deleteActivity(activity)

            return res.json(message)
        } catch (e) {
            next(e)
        }
        
    }

    async deleteTypeActivity(req, res, next) {
        const {typeActivityId} = req.params
        try {
            const typeActivity = await activityService.findTypeActivity(typeActivityId)
            const message = await activityService.deleteTypeActivity(typeActivity)

            return res.json(message)
        } catch (e) {
            next(e)
        }
    }

    async deleteTypeSport(req, res, next) {
        const {sportId} = req.params
        try {
            const message = await activityService.deleteTypeSport(await activityService.findTypeSport(sportId))
            return res.json(message)
            
        } catch (e) {
            next(e)
        }
    }

    
    async getAll(req, res, next) {
        const {params, query} = req

        try {
            const activities = await activityService.findAllActivites()
            return res.json(activities)
        } catch (e) {
            next(e)
        }
    }

    async getActivity(req, res, next) {
        const {activityId} = req.params
        try {
            const activity = await activityService.findActivity(activityId)
            return res.json(activity)
        } catch(e) {
            next(e)
        }
    }

    async getUserActivity(req, res, next) {
        const {userId} = req.params
        try {
            await userService.getUserByPk(userId)
            const listActivity = await activityService.findUserActivity(userId, req.query)
            return res.json(listActivity)
        } catch(e) {
            next(e)
        }
    }

    async checkoutStatistic(req, res, next) {
        const {activityId} = req.params
        const {id} = req.userInfo

        try {
            const {rows} =  await activityService.findUserActivity(id, {id: activityId})
            let message = {message: "Нет доступа к этой активности или она не существует!"}
            if (rows.length === 0 || rows === undefined) return res.json(message)
            
            const dateNowMinusPlane = Date.now() - rows[0].plan_date
            const young = dateNowMinusPlane < 0
            const normal = dateNowMinusPlane >= 0 && dateNowMinusPlane <= rows[0].timeline
            const late = dateNowMinusPlane > rows[0].timeline
        
            if (young) {
                message = {message: "Время еще не пришло"}
            } else if (normal && !rows[0].checkout) {
                message = await activityService.updateActivity({checkout: true}, rows[0]) 
                const statistic = await statisticService.findParam("checkoutActivity")
                userService.addScores(rows[0])
                statisticEventEmmiter.PushStatistic(rows[0].userId, {id: statistic.id}, 1)
            } else if (late) {
                message = {message: "Вы опоздали!"}
            }
            
            return res.json(message)
        } catch (e) {
            next(e)
        }

       
    }

    async getActivityByDate(req, res, next) {
        const {dateTo, dateFrom} = req.params

        try {
            const activities = await activityService.findAllActivites({dateFrom, dateTo, userId: req.userInfo.id})
            return res.json(activities)
        } catch (e) {
            next(e)
        }
    }

    async updateActivity(req, res, next) {
        if (req.body == null) throw ApiError.EmptyRequest()
        const {activityId, activitiesTypeId, sportTypeId, planeDate, timeline} = req.body

        try {
            await activityService.findTypeActivity(activitiesTypeId)
            await activityService.findTypeSport(sportTypeId)
            const activity = await activityService.findActivity(activityId)

            const message = await activityService.updateActivity({activitiesTypeId, sportTypeId, plan_date: planeDate, timeline}, activity) 
            return res.json(message)
        } catch (e) {
            next(e)
        }

       
    }
}

export default new ActivityController