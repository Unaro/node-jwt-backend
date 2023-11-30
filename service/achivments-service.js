import ApiError from "../error/ApiError.js";
import achivmentsModel from "../models/achivments-model.js";

class KeyFormatter {
    static TextShape(value = "") {
        //value.startsWith('<') && value[1] !== "="
        let result = `return value`

        switch (value.slice(0,1)) {
            case "=":
                if (value.startsWith("==")) return result += value
                result += ">="+value.slice(1)
                break

            default:
                if (!value.startsWith(">") 
                && !value.startsWith("<") 
                && !value.startsWith("=")) return result += "=="+value
                result += value
                break;
        }
    return result
    }
}

class AchivmentsService {
    
    async CreateAchievement(achiementInfo = ["",[]]) {
        const [name, methods] = achiementInfo
        const params = []

        if (await achivmentsModel.Achievements.findOne({where: {name}})) return  
        const achievement = await achivmentsModel.Achievements.create({name})

        
        try {
            for (const method of methods) {
                let keys = Object.keys(method)
                
                for (let key of keys) {
                    const param = await achivmentsModel.Params.findOne({where: {name: key}})
                    params.push(await achivmentsModel.AchievmentParams.create({target: method[key], 
                        paramId: param.id, achievementId: achievement.id}))
                }
                    
            }   
        } catch (e) {
            throw e
        }
        
        
    }

    async GetAll() {
        const achievements = await achivmentsModel.Achievements.findAndCountAll({include: {model: achivmentsModel.AchievmentParams}})

        return achievements
    }

}

export default new AchivmentsService