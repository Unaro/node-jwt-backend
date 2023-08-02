import { validationResult } from "express-validator"
import ApiError from "../error/ApiError.js"
import userService from "../service/user-service.js"

class UserController {
    
    async create(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next(ApiError.badRequest("Ошибка при валидации", errors.array()))
        }

        const {reportCard, password} = req.body
        if (!reportCard) {
            return next(ApiError.badRequest("Пользователь не может быть пустым", errors.array()))
        }

        try {
            const userData = await userService.registration(reportCard, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        const {reportCard, password} = req.body
        try {
            const userData = await userService.login(reportCard, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        const {refreshToken} = req.cookies
        try {
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        const {refreshToken} = req.cookies
        try {
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            console.log(e.message)
            next(e)
        }
    }

    async update(req, res, next) {

    }

    async delete(req, res, next) {
        
    }
    
    async welcome(req, res, next) {
        res.status(200).json({message: "Страница пользователей"})
    }

    async getUsers(req, res, next) {
        const {query, params} = req
        try {
            console.log(params)
            const users = await userService.getAllUsers({query, params})
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

    async getOneUser(req, res, next) {
        const userInfo = req
        try {
            const user = await userService.getOneUser(userInfo)
            res.json(user)
        } catch(e) {
            next(e)
        }
    }
}

export default new UserController