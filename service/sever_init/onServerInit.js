import achivmentsService from "../achivments-service.js";
import roleService from "../role-service.js";
import statisticService from "../statistic-service.js";

const _baseUserRoles = [["USER", 1], ["ADMIN", 10], ["MODER", 7]]
const _baseUserStatistic = [
    ["login_in", "Количество входов"], 
    ["logout", "Количество выходов"], 
    ["createActivity", "Количество запланированных активностей"],
    ["checkoutActivity", "Количество отмеченных активностей"]
]

const _baseAchievements = [
    ["Великие подвиги начинаются...", [{login_in: 100}]],
    ["Атлант расправил плечи", [{checkoutActivity: 50}, {createActivity: 50}]],
    ["Как к себе домой", [{checkoutActivity: 150}, {createActivity: 150}]],
    ["Даже великим нужен отдых", [{logout: 55}]]
]

class OnServerInit {

    async AddBaseRoles() {
        let array = []
        for (let i = 0; i < _baseUserRoles.length; i++) {
            const element = _baseUserRoles[i]
            
            if (!await roleService.findRole(element[0])) {
                array.push(await roleService.createRole(element[0], element[1]))
            }
            
        }
        return array
    }

    async AddBaseParams() {
        let array = []
        for (let element of _baseUserStatistic)  {

            if (!await statisticService.findParam(element[0])) {
                array.push(await statisticService.createParam(...element))
            }

        }
    }

    async AddBaseAchievements() {
        for (let achievement of _baseAchievements) {

            await achivmentsService.CreateAchievement(achievement)
            
        }
    }
    
}
export default new OnServerInit();