class authHandling {
    check(req, res, next) {
        if (!req.cookie) {
            console.log('false')
        }

        next()
    }
}

export default new authHandling()