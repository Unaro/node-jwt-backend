import ApiError from "../error/ApiError.js"
import tokenService from "../service/token-service.js"
import userService from "../service/user-service.js"

import { parseFromString } from 'dom-parser';
const sibadi_dek = 'https://umu.sibadi.org/Dek/Default.aspx?mode=stud&f=group&id='
const api_group = 'https://umu.sibadi.org/api/raspGrouplist'

async function getUser(name, group) {
    let user = null
    const data = await fetch(api_group, 
    {
        headers:{
            contentType: "text/json",
            AcceptLanguage: 'ru-RU,ru;q=0.6'
        }
    })
    const jsonData = await data.json()
    for (let i = 0; i < jsonData.data.length; i++) {
        const element = jsonData.data[i]
        if (!group.toLowerCase().includes(element.name.toLowerCase())) {
            continue
        }
        console.log(element)
        user = element
        user.number = name.slice(-7, -5) + name.slice(-3)
        break
    }
    return await checkUser(user)
}

async function checkUser(user) {
    console.log(user)
    const site = await fetch(sibadi_dek+user?.id)
    const text = new TextDecoder('windows-1251').decode(await site.arrayBuffer())
    const html = parseFromString(text)

    user.isStudent = false

    for (let i = 0; i < html.getElementsByClassName('dxeHyperlink_MaterialCompact').length; i++) {
        if (i % 2 != 0) { continue }
        const element = html.getElementsByClassName('dxeHyperlink_MaterialCompact')[i];
        if (element.innerHTML.endsWith(user?.number)) {
            user.isStudent = true
            break
        }
    }
    if (!user.isStudent) {
        throw ApiError.NotEnoughPermission()
    }

    return user
}

class AuthHandling {


    static async isStudent(req, res, next) {

        const {login, group} = req.body
        try {
            if (!login || !group) throw ApiError.EmptyRequest()
            const user = await getUser(login, group)

            req.groupInfo = user
            next()
        } catch (e) {
            next(e)
        }
    }

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