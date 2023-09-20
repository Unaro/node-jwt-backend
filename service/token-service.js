import jwt from 'jsonwebtoken';
import models from '../models/token-model.js';
import ApiError from '../error/ApiError.js';

class TokenService {
    generateTokens(payload) {
        console.log(payload)
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
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        //Требуется доработка
        const token = await models.Token.create({userId, refreshToken})
        return token;
    }

    async removeToken(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError()
        
        await models.Token.destroy({where: {refreshToken}})
        return {message: "Вы успешно вышли из аккаунта!"}
    }

    async findToken(refreshToken) {
        const tokenData = await models.Token.findOne({where: {refreshToken}})
        if (!tokenData) throw ApiError.EmptyRequest()
        return tokenData;
    }
}

export default new TokenService();
