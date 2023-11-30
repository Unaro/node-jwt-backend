import userService from "../service/user-service.js"


class RaitingController {
    async GetProfileRaiting(req, res, next) {
        const {id} = req.userInfo
        try {
            const raiting = await userService.getProfileRaiting(id)

            return res.json(raiting)
        } catch (e) {
            next(e)
        }
    }

    async GetAll(req, res, next) {
        try {
            const best10 = await userService.getRaiting(10)

            return res.json(best10)
        } catch (e) {
            
        }
    }

    async DeleteRole(req, res, next) {

    }
}

export default new RaitingController