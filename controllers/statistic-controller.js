import ApiError from "../error/ApiError.js"
import statisticService from "../service/statistic-service.js"

class StatisticController { 

    async getAll(req, res, next) {
        const array = await statisticService.getAllParams()
        return res.json(array)
    }

    async addStatisticToUserById(req, res, next) {
        const {statisticId, amount = 1, userId = null} = req.body
        let result = {statisticId, amount, isAdmin: false, isCurrentUser: false}
        try {

            if (req.userInfo.id == userId) {
                result.isCurrentUser = true 
            } else {
                for (let elem of req.userInfo.roles) {
                    if (elem.roleRaiting === 10) {
                        result.isAdmin = true
                    }
                }
            }

            if (result.isAdmin || result.isCurrentUser) {
                result.info = await statisticService.addUserStatistic(userId, statisticId, amount)
            }
            
            return res.json(result)
        } catch (e) {
            next(e)
        }
    }
}

export default new StatisticController