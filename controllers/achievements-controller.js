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
}

export default new AchievmentController