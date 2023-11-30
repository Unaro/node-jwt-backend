import ApiError from "../error/ApiError.js"
import tokenService from "../service/token-service.js"
import userService from "../service/user-service.js"

class AuthHandling {

    static async getUserInfo(req, res, next) {
        
        if (Object.entries(req.cookies).length === 0) {
            req.userInfo = null
            return next()
        }
        try {
            const user = tokenService.validateRefreshToken(req.cookies.refreshToken)
            req.userInfo = await userService.getUserByPk(user.payload.id)
            next()
        } catch (e) {
            next(e)
        }
        
    }

    static async findUser(req, res, next) {
        try {
            if (!req.userInfo) throw ApiError.UnauthorizedError()
            const user = await userService.getUserByPk(req.userInfo.id)
            next()
        } catch (e) {
            next(e)
        }
       
    }

    static isAdmin(req, res, next) {
        if (!req.userInfo) throw ApiError.UnauthorizedError()
        
        for (let element of req.userInfo.roles) {
            if (element.roleRaiting === 10) {
                return next()
            }
        }
        throw ApiError.NotEnoughPermission()
    }

    static isUser(req, res, next) {
        
        try {
            if (!req.userInfo) throw ApiError.UnauthorizedError()
        
            for (let element of req.userInfo.roles) {
                if (element.roleRaiting >= 1) {
                    return next()
                }
            }
            throw ApiError.NotEnoughPermission()
        } catch (e) {
            next(e)
        }
        
        
    }
}

export default AuthHandling