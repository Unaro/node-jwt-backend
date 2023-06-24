class ActivityController {
    async getAll(req, res) {
        res.status(200).json({message: "Страница активности", ...req.query})
    }
}

export default new ActivityController