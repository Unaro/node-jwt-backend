import ApiError from "../error/ApiError.js"
import achivmentsModel from "../models/achivments-model.js"
import userModel from "../models/user-model.js"
import statisticEventEmmiter from "./event_handlers/statisticEventEmmiter.js"

class StatisticService {
    async getAllParams() {
        const array = await achivmentsModel.Params.findAndCountAll()
        
        return array 
        
    }

    async findParam(name) {
        return await achivmentsModel.Params.findOne({where: {name}})   
    }
    async findParamById(id) {
        return await achivmentsModel.Params.findByPk(id)
    }
    
    async deleteParam(id) {

    }

    async updateParam(id, targetName) {

    }

    async createParam(name, targetName) {
        if (!name && !targetName) throw ApiError.EmptyRequest()

        return await achivmentsModel.Params.create({name, targetName})
    }

    async addUserStatistic(userId, statisticId, amount) {
        const [userStat, created] = await userModel.UserStatistic.findOrCreate(
            {
                where: {userId, paramId: statisticId}, 
                defaults: {userId, paramId: statisticId, amount: 0}
            }
        )
        const updated = await userStat.update({amount: userStat.amount + amount})
        


        const statisticUser = await userModel.UserStatistic.findOne({where: {userId, paramId: statisticId}, attributes: ["id", "amount", "userId"],
            include: {model: achivmentsModel.Params,  attributes: ["id", "name"],
                include: {model: achivmentsModel.AchievmentParams,  attributes: ["id", "target"],
                    include: {model: achivmentsModel.Achievements, attributes: ["id", "name"], 
                        include: {model: achivmentsModel.AchievmentParams,  attributes: ["id", "target", "paramId"]}}}
                }
            })

        if (statisticUser.amount >= statisticUser.param.achievment_params[0].target) {
            for (const achievmentParam of statisticUser.param.achievment_params) {
                const filtered = []
                const {count} = await userModel.UserAchievments.findAndCountAll({where: {achievementId: achievmentParam.achievement.id, userId}})
                if (count !== 0) {
                    continue
                }
                for (const param of achievmentParam.achievement.achievment_params) {
                    
                    const localStat = await userModel.UserStatistic.findOne({where: {userId, paramId: param.paramId}})
    
                    if (localStat.amount >= param.target) {
                        filtered.push(true)
                    } else {
                        filtered.push(false)
                        break
                    }
    
                }
                if (!filtered.includes(false)) await userModel.UserAchievments.create({achievementId: achievmentParam.achievement.id, userId})
                console.log(filtered)
            }
        }
        
       
        // if (!filtered.includes(false)) {
        //     const achievement = await userModel.UserAchievments.create({achievementId: achievement.id, userId})

        //     console.log(achievement.dataValues)
        // }
        
       

        if (created) {
            return {message: "Статистика создана и обновлена!", updated}
        }
        return {message: "Статистика обновлена!", statisticUser}
    }

}

export default new StatisticService()