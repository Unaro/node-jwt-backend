import achivmentsService from "../service/achivments-service.js"

class AchievmentController { 
    async getAll(req, res, next) {
        const achievemnts = await achivmentsService.GetAll()
    
        return res.json(achievemnts)
    }

    async create(req, res, next) {
        const {name, methods} = req.body

        try {
            const achievement = await achivmentsService.CreateAchievement([name, methods])

            return res.json(achievement)
        } catch (e) {
            next(e)
        }
        
    }

    async getUserAchievements(req, res, next) {
        const {id} = req.userInfo
        const achievemnts = await achivmentsService.GetUserAchievements(id)
    
        return res.json(achievemnts)
    }
}

export default new AchievmentController