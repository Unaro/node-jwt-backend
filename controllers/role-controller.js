import userService from "../service/user-service.js"
import roleService from "../service/role-service.js"

class RoleController {
    async GetRoles(req, res, next) {
        try {
            const roles = await roleService.getRoles()
            return res.json(roles)

        } catch (e) {
            next(e)
        }
    }

    async GetUserRoles(req, res, next) {
        const {userId} = req.params

        try {
            const roles = await roleService.getUserRoles(userId)
            return res.json(roles)

        } catch (e) {
            next(e)
        }
    }

    async GetRoleByPK(req, res, next) {
        const {roleId} = req.params

        try {
            const role = roleService.findRoleByPk(roleId);
            return res.json(role)
        } catch (e) {
            next(e)
        }

        
    }

    async CreateRole(req, res, next) {
        const name = req.body.name;
        const roleRaiting = req.body.roleRaiting;
        try {
            let role = null;
            if (!await roleService.findRole(name)) role = await roleService.createRole(name, roleRaiting)
            res
            .json(role)
            .status(201)
        } catch (e) {
            next(e)
        }
    }

    async AddRoleToUser(req, res, next) {
        const {userId, roleId} = req.body

        try {
            await userService.getUserByPk(userId)
            await roleService.findRoleByPk(roleId)
            await roleService.addRoleToUser(userId, roleId)

            return res.json({message: "Роль успешно добавлена!"})
        } catch (e) {
            next(e)
        }

    }

    async RemoveRoleToUser(req, res, next) {
        const {userId, roleId} = req.body

        try {
            await userService.getUserByPk(userId)
            await roleService.findRoleByPk(roleId)
            await roleService.RemoveRoleToUser(userId, roleId)

            return res.json({message: "Роль успешно добавлена!"})
        } catch (e) {
            next(e)
        }
    }

    async Update(req, res, next) {

    }

    async DeleteRole(req, res, next) {

    }
}

export default new RoleController