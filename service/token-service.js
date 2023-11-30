import jwt from 'jsonwebtoken';
import models from '../models/token-model.js';
import ApiError from '../error/ApiError.js';
import statisticEventEmmiter from './event_handlers/statisticEventEmmiter.js';
import statisticService from './statistic-service.js';

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign({payload}, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign({payload}, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            throw ApiError.UnauthorizedError()
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            throw ApiError.UnauthorizedError()
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await models.Token.findOne({where: {userId}})
        
        const statistic = await statisticService.findParam("login_in")
        statisticEventEmmiter.PushStatistic(userId, {id: statistic.id}, 1)
        
        if (tokenData) {
            const statistic = await statisticService.findParam("logout")
            statisticEventEmmiter.PushStatistic(userId, {id: statistic.id}, 1)
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        
        //Требуется доработка
        const token = await models.Token.create({userId, refreshToken})
       
        return token;
    }
    
    async removeToken(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError()
        const user = this.validateAccessToken(refreshToken)

        
        await models.Token.destroy({where: {refreshToken}})
        statisticEventEmmiter.PushStatistic(user.id, {id: await statisticService.findParam("login_out").id}, 1)
        return {message: "Вы успешно вышли из аккаунта!"}
    }

    async destroyUserTokens(userId) {
        if (!userId) throw ApiError.EmptyRequest()
        await models.Token.destroy({where: {userId}})
        return {message: "Все токены успешно удалены!"} 
    }

    async findToken(refreshToken) {
        const tokenData = await models.Token.findOne({where: {refreshToken}})
        if (!tokenData) throw ApiError.EmptyRequest()
        return tokenData;
    }
}

export default new TokenService();
