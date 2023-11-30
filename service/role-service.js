import ApiError from "../error/ApiError.js";
import userModels from "../models/user-model.js";

class RoleService {

    async addRoleToUser(user, role) {
        const userId = user.id
        const roleId = role.id
        
        const roleUser = await userModels.RoleUser.create({userId, roleId})
        return roleUser
    }

    async RemoveRoleToUser(user, role) {
        const userId = user.id
        const roleId = role.id
        
        const roleUser = await userModels.RoleUser.destroy({userId, roleId})
        return roleUser
    }

    async UpdateRole(role, updatedInfo) {
        if (!updatedInfo) throw ApiError.EmptyRequest()
        await role.update(updatedInfo)
        return {message: "Данные обновлены!"}
    }

    async createRole(name, roleRaiting) {
        if (!name || !roleRaiting) throw ApiError.DoesNotExist()
        const role = await userModels.Role.create({name, roleRaiting})
        return role
    }

    IsUserInludeRole(user, roleName) {
        user.roles.forEach(element => {
            if (element.name == roleName) return true
        })
        return false
    }
    async getRoles() {
        return await userModels.Role.findAndCountAll();
    }

    async findRole(name) {
        if (!name) throw ApiError.DoesNotExist()

        return await userModels.Role.findOne({where: {name}})
    }

    async findRoleByPk(id) {
        if (!id) throw ApiError.DoesNotExist()

        return await userModels.Role.findOne({where: {id}})
    }

    async getUserRoles(userId) {
        if (!userId) throw ApiError.EmptyRequest()
        const roles = await userModels.RoleUser.findAll({where: userId})

        return roles
    }

    async deleteAllUserRoles(userId) {
        if (!userId) throw ApiError.EmptyRequest()
        await userModels.RoleUser.destroy({where: userId})

        return {message: "Роли пользователя успешно удалены!"}
    }
}

export default new RoleService()