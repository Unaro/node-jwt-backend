import ApiError from "../error/ApiError.js"
import models from "../models/user-model.js"
const {User} = models
import bcrypt from 'bcrypt'
import Generator from "./generator.js"
import UserChecker from "./user-checker.js"
import activityModel from "../models/activity-model.js"
import UserDto from "./user-dto.js"



class UserService {

    async registration(login, password) {
        
        if (!login) throw ApiError.EmptyRequest()
        if (await User.findOne({where: {login}})) throw ApiError.UserCreated(login)
        
        if (!password) {
            password = Generator.generatePassowrd(12)
            var isAutogen = true
        }

        const hashPassword = await bcrypt.hash(password, 3)
        
        // дописать когда появится api сибади
        // не появится....

        const user = await User.create({login, password: hashPassword})
        
        if (isAutogen) user.generatedPassowrd = password
        return user
    }

    async delete(user) {
        
        if (!user) throw ApiError.badRequest("Пользователя не существует")

        await user.destroy()
        
        return {message: "Аккаунт успешно удален"}
    }

    async login(login, password) {

        const user = await User.findOne({where: {login}})
        if (!user) throw ApiError.badRequest('Пользователь с такой зачеткой еще не зарегистрирован')
        if (!await bcrypt.compare(password, user.password)) throw ApiError.badRequest('Неверный пароль')
        
        return user
    }

    async update(newInfo, user) {
        
        const newUser = new UserChecker(user, newInfo)
        if(Object.entries(newUser).length === 0) throw ApiError.EmptyRequest()
        const updatedUser = new UserDto(await user.update({...newUser}), 2)
        return {message: "Данные обновлены!", updatedUser}
    }

    //подумать над нужностью данной функции
    // async refresh(refreshToken) {
        
    //     if (!refreshToken) throw ApiError.UnauthorizedError()
        
    //     //Подумать над перемещением
    //     const userData = tokenService.validateAccessToken(refreshToken)
    //     const tokenFromDb = await tokenService.findToken(refreshToken)
    //     if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError()


    //     const user = await User.findByPk(userData.id)
    //     const userDto = new UserDto(user)
    //     const tokens = generateTokens({...userDto})

    //     await saveToken(userDto.id, tokens.refreshToken)
    //     return {...tokens, user: userDto}
    // }

    async getAllUsersQuery({query, params}) {
        
        const {limit = 50, offeset = 0, ...otherQuery} = query ? query : {limit: 50}
        
        const {_, rows} = await User.findAndCountAll({
            where: {id: params?.id, ...otherQuery},
            attributes: ['id', 'login'],
            limit,
            offeset
        })

        return rows
    }

    async getAllUsers(limit, offeset) {
        return await User.findAndCountAll({attributes: ['id', 'login'], limit, offeset})
    }

    async getUserByPk(id) {
        
        if (!Number.isInteger(parseInt(id))) throw ApiError.badRequest("Неправильный тип запроса!")
        
        const user = await User.findByPk(id, {attributes: ["id", "login", "isStudy", "email", "firstname", "lastname", "patronymic", "height", "weight", "createdAt", "updatedAt"]})
        if (!user) throw ApiError.badRequest("Пользователь не найден")
        
        return user
    }

    async getUserByLogin(login) {
        
        const user = await User.findOne({where: {login}, include: activityModel.SportType, attributes: ["id", "login", "isStudy", "email", "firstname", "lastname", "patronymic", "height", "weight", "createdAt", "updatedAt"]})
        if (!user) throw ApiError.badRequest("Пользователь не найден")
        
        return user
    }




}

export default new UserService()