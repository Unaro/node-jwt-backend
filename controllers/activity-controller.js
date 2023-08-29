import ActivityService from "../service/activity-service.js"

class ActivityController {
    async getAll(req, res) {
        return res.status(200).json({message: "Страница активности", ...req.query})
    }

    async getActivity(req, res, next) {
        const {query, params} = req
        try {
            const activity = await ActivityService.findActivity(params)
            return res.json(activity)
        } catch(e) {
            next(e)
        }
    }

    async getUserActivity(req, res, next) {
        const {query, params} = req
        try {
            const listActivity = await ActivityService.findUserActivity(params?.userId, query)
            return res.json(listActivity)
        } catch(e) {
            next(e)
        }
    }

    async createActivity(req, res, next) {
        const {body} = req
        try {
            await ActivityService.createActivity(body)
            return res.status(201).json({message: "Активность создана!"})
        } catch(e) {
            next(e)
        }
    }
}

export default new ActivityController