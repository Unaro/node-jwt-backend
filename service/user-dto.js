export default class UserDto {
    constructor({id, login, isStudy, email, firstname, lastname, patronymic, height, weight, createdAt, updatedAt}, mode = 0) {
        this.id = id
        this.login = login
        if (mode > 0) {
            this.isStudy = isStudy
            this.email = email
            this.firstname = firstname
            this.lastname = lastname
            this.patronymic = patronymic
            if (mode > 1) {
                this.height = height
                this.weight = weight
                this.createdAt = createdAt
                this.updatedAt = updatedAt
            }
        }
    }
}