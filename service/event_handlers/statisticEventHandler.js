const events = ['statistic']
import statisticService from "../statistic-service.js";
import userService from "../user-service.js";
import statisticEventEmmiter from "./statisticEventEmmiter.js";

class statisticHandler{

    constructor(statisticEventEmmiter) {
        console.log('Обработчик событий запущен!')
        statisticEventEmmiter.on(events[0], this.AddStatistic)
    }

    async AddStatistic(args) {
        try {
            console.log(args)
            const param = await statisticService.findParamById(args.statistic.id)
            const user = await userService.getUserByPk(args.userId)
            const statistic = await statisticService.addUserStatistic(user.id, param.id, args.count)


            console.log(statistic.message)
        } catch (e) {
            console.log(e)
        }
        
    }
}

export default new statisticHandler(statisticEventEmmiter);