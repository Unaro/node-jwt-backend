import { validationResult } from "express-validator"
import ApiError from "../error/ApiError.js"
import userService from "../service/user-service.js"
import tokenService from "../service/token-service.js"
import UserDto from "../service/user-dto.js"
import roleService from "../service/role-service.js"
import activityService from "../service/activity-service.js"
import addUserStatistic from "../service/event_handlers/statisticEventEmmiter.js"
import userModel from "../models/user-model.js"

class UserController {
    
    async create(req, res, next) {
        
        const {login, password} = req.body

        try {
            const user = await userService.registration(login, password)
            const userDto = new UserDto(user)
            const tokens = tokenService.generateTokens(userDto)
            await tokenService.saveToken(userDto.id, tokens.refreshToken)
            userDto.role = await roleService.addRoleToUser(user, await roleService.findRole("USER"))
            
            return res
                    .status(201)
                    .cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
                    .json({...userDto, password: user?.generatedPassowrd, accessToken: tokens.accessToken})
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        
        const {login, password} = req.body
        
        try {
            const userDto = new UserDto(await userService.login(login, password))
            const tokens = tokenService.generateTokens(userDto)
            await tokenService.saveToken(userDto.id, tokens.refreshToken)
            
            return res
                    .cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
                    .json({...userDto, accessToken: tokens.accessToken})
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        
        const {refreshToken} = req.cookies
        
        try {
            const message = await tokenService.removeToken(refreshToken)
            
            return res
                .clearCookie('refreshToken')
                .json(message)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        const {refreshToken} = req.cookies
        
        try {
            const userFromToken = tokenService.validateRefreshToken(refreshToken)
            await tokenService.findToken(refreshToken)
            
            const userDto = new UserDto(await userService.getUserByPk(userFromToken.id))
            const tokens = tokenService.generateTokens(userDto)

            await tokenService.saveToken(userDto.id, tokens.refreshToken)
            
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json({...userDto, accessToken: tokens.accessToken})
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next) {
        //нужна будет заготовка для реализации обновления с правами админа
        const newInfo = req.body

        try {
            const user = req.userInfo
            const message = await userService.update(newInfo, user)
            
            return res
                    .json(message)
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        const {id} = req.body
        
        try {
            //все удаление еще не реализовано
            const user = await userService.getUserByPk(id)
            await roleService.deleteAllUserRoles(user.id)
            await tokenService.destroyUserTokens(user.id)
            await activityService.deleteAllUserActivity(user.id)
            const message = await userService.delete(user)
            
            return res
                    .json(message)
        } catch (e) {
            next(e)
        }
        
    }
    
    async welcome(req, res, next) {
        return res
                .status(200)
                .json({message: "Страница пользователей"})
    }   

    async getUsers(req, res, next) {
        const {query, params} = req
        try {
            //Нужен разветвитель в зависимости от параметров и запросов
            const users = await userService.getAllUsers(query?.limit, query?.offset) //getAllUsersQuery
            return res
                    .json(users)
        } catch (e) {
            next(e)
        }
    }

    async getOneUser(req, res, next) {
        const {userIdOrLogin} = req.params
        
        try {
            const user = await userService.getUserByPk(userIdOrLogin)
            return res
                    .json(user)
        } catch(e) {
            try {
                const user = await userService.getUserByLogin(userIdOrLogin)
                return res
                        .json(user)
            } catch (e) {
                next(e)
            }
        }
    }

    async updateIMT(req, res, next) {
        const {userId, weight} = req.body
        
        try {
            const created = await userService.updateIMT(userId, weight)

            return res.json(created)
        } catch (e) {
            next(e)
        }
        
    }
}

export default new UserController()