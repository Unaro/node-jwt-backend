class authHandling {
    async check(req, res, next) {
        if (!req.cookie) {
            console.log('noCookie')
        }

        next()
    }
}

export default new authHandling()