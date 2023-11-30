export default class UserDto {
    constructor({id, login, email, createdAt, updatedAt}, mode = 0) {
        this.id = id
        this.login = login
        if (mode > 0) {
            this.email = email
            if (mode > 1) {
                this.createdAt = createdAt
                this.updatedAt = updatedAt
            }
        }
    }
}