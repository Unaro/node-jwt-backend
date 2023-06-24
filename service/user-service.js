import ApiError from "../error/ApiError.js"
import models from "../models/user-model.js"
import bcrypt from 'bcrypt'
import UserDto from "./user-dto.js"
import tokenService from "./token-service.js"
import Generator from "./generator.js"

class UserService {
    async registration(reportCard) {
        const password = Generator.generatePassowrd(12)
        const candidate = await models.User.findOne({where: {reportCard}})
        
        // дописать когда появится api сибади
        if (candidate) {
            console.log(candidate.dataValues)
            throw ApiError.badRequest(`Пользователь с зачетной книжкой ${reportCard} уже зарегистрирован!`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const user = await models.User.create({reportCard, password: hashPassword})
        
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto, password}
    }

    async login(reportCard, password) {

        const user = await models.User.findOne({where: {reportCard}})
        if (!user) {
            throw ApiError.badRequest('Пользователь с такой зачеткой еще не зарегистрирован')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.badRequest('Неверный пароль')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateAccessToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await models.User.findByPk(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async getAllUsers({query, params}) {
        if (Object.entries(query).length == 0 && Object.entries(params).length  == 0) {
            return await models.User.findAll({
                attributes: ['id', 'reportCard', 'createdAt']
        })
        }
        
        const {limit, ...otherQuery} = query ? query : {limit: 50}
        const id = params.id || -1
        const {_, rows} = await models.User.findAndCountAll({
            where: {id, ...otherQuery},
            attributes: ['id', 'reportCard', 'createdAt'],
            limit
        })

        return rows
    }

    async delete({body}) {
        if (Object.entries(body).length == 0) {
            throw ApiError.badRequest('Пустой запрос!')
        }
        await models.User.findOne({where: {id: body.id, reportCard: body.reportCard}})
        .then(user => {
            if (user == null) {
                throw ApiError.badRequest("Пользователя не существует")
            }
        user.destroy()
        })
        .finally(() => {
            return {message: "Аккаунт успешно удален"}
        })
        
    }

}

export default new UserService()