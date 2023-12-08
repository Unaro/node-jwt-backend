import ApiError from "../error/ApiError.js"
import models from "../models/user-model.js"
const {User, Role} = models
import bcrypt from 'bcrypt'
import Generator from "./generator.js"
import UserChecker from "./user-checker.js"
import activityModel from "../models/activity-model.js"
import UserDto from "./user-dto.js"
import userModel from "../models/user-model.js"



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
        if (!user && !await bcrypt.compare(password, user.password)) throw ApiError.badRequest('Неверный логин или пароль!')
        
        return user
    }

    async update(newInfo, user) {
        
        const newUser = new UserChecker(user, newInfo)
        if (Object.entries(newUser).length === 0) throw ApiError.EmptyRequest()
        const updatedUser = new UserDto(await user.update({...newUser}), 2)
        return {message: "Данные обновлены!", updatedUser}
    }

    async updateIMT(userId, weight) {
        
        if (!userId || !weight) throw ApiError.EmptyRequest()
        const imt = await userModel.IMT.create({userId, weight})

        return imt
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

    async getAllUsers(limit, offset) {
        return await User.findAndCountAll({attributes: ['id', 'login'], limit: limit || 50, offset})
    }

    async getUserByPk(id) {
        
        if (!Number.isInteger(parseInt(id))) throw ApiError.badRequest("Неправильный тип запроса!")
        
        const user = await User.findByPk(id, {attributes: ["id", "login", "email", "createdAt", "updatedAt"], include: [{model: Role}]})
        if (!user) throw ApiError.badRequest("Пользователь не найден")
        
        return user
    }

    async getUserByLogin(login) {
        
        const user = await User.findOne({where: {login}, include: activityModel.SportType, attributes: ["id", "login", "email", "createdAt", "updatedAt"]})
        if (!user) throw ApiError.badRequest("Пользователь не найден")
        
        return user
    }

    //Рейтинг

    async getProfileRaiting(userId) {
        console.log(userId)
        const raiting = await models.Scores.findAll({where: {userId}})
       
        
        let value = 0
        for (let score of raiting) {
            value += score.amount
        }
        const result = {userId, scores: value || 0}
        return result
    }

    async getRaiting(countUsers = 10) {
        const {rows, count} = await models.Scores.findAndCountAll()
        let result = []
        let ids = {}
        for (let score of rows) {
            const user = await this.getUserByPk(score.userId)
            if (!ids.hasOwnProperty(score.userId)) {
                ids[user.id] = {login: user.login, scores: score.amount}
            } else {
                ids[user.id]["scores"] += score.amount
            }
        }    

        for (let i in ids) {
            result.push({id: +i, login: ids[i]["login"], scores: ids[i]["scores"]})
        }
        result = result.sort((a, b) => b.scores - a.scores)
        if (result.length > countUsers) result.length = countUsers

        return result
    }

    async addScores(activity) {
        const userId = activity.userId
        const activityId = activity.id

        const score = await models.Scores.create({amount: 5, userId, activityId}) //Исправить кол-во баллов

        return score
    }

}

export default new UserService()