import ApiError from "../error/ApiError.js"
import models from "../models/user-model.js"
const {User} = models
import bcrypt from 'bcrypt'
import UserDto from "./user-dto.js"
import tokenService from "./token-service.js"
const {generateTokens, saveToken} = tokenService
import Generator from "./generator.js"



class UserService {

    async registration(reportCard, password) {
        
        let isAutogen
        if (!password) {
            password = Generator.generatePassowrd(12)
            isAutogen = true
        }
        
        const candidate = await User.findOne({where: {reportCard}})
        // дописать когда появится api сибади
        if (candidate) throw ApiError.UserCreated(reportCard)
        const hashPassword = await bcrypt.hash(password, 3)

        const user = await User.create({reportCard, password: hashPassword})
        
        const userDto = new UserDto(user)
        const tokens = generateTokens({...userDto})
        await saveToken(userDto.id, tokens.refreshToken)
        
        if (isAutogen) userDto.generatePassowrd = password
        return {...tokens, user: userDto}
    }

    async login(reportCard, password) {

        const user = await User.findOne({where: {reportCard}})
        if (!user) throw ApiError.badRequest('Пользователь с такой зачеткой еще не зарегистрирован')
        if (!await bcrypt.compare(password, user.password)) throw ApiError.badRequest('Неверный пароль')
        const userDto = new UserDto(user)
        const tokens = generateTokens({...userDto})
        
        await saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError()
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError()
        
        const userData = tokenService.validateAccessToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError()

        const user = await User.findByPk(userData.id)
        const userDto = new UserDto(user)
        const tokens = generateTokens({...userDto})

        await saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async getAllUsers({query, params}) {
        if (Object.entries(query).length == 0 && Object.entries(params).length  == 0) return await User.findAll({attributes: ['id', 'reportCard', 'createdAt']})
        
        const {limit, ...otherQuery} = query ? query : {limit: 50}
        const id = params?.id
        const {_, rows} = await User.findAndCountAll({
            where: {id, ...otherQuery},
            attributes: ['id', 'reportCard', 'createdAt'],
            limit
        })

        return rows
    }

    async getOneUser({query, params}) {
        const {id} = params
        
        const user = await User.findByPk(id)
        if (!user) throw ApiError.badRequest("Пользователь не найден")
        return user
    }

    async delete({body}) {
        if (Object.entries(body).length == 0) throw ApiError.badRequest('Пустой запрос!')
        
        await User.findOne({where: {id: body.id, reportCard: body.reportCard}})
        .then(user => {
            if (user == null) throw ApiError.badRequest("Пользователя не существует")
            user.destroy()
        })
        
        return {message: "Аккаунт успешно удален"}
    }


}

export default new UserService()