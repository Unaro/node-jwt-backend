class ApiError extends Error{
    status
    errors

    constructor(status, message, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static badRequest(message, errors = []) {
        return new ApiError(400, message, errors)
    }

    static UserCreated(rc) {
        return new ApiError(400, `Пользователь ${rc} уже существует!`)
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static forbidden(message) {
        return new ApiError(403, message)
    }

    static DoesNotExist() {
        return new ApiError(404, 'Не удалось найти запрашиваемый ресурс 404!')
    }

    static EmptyRequest() {
        return new ApiError(404, 'Отправлен пустой запрос!')
    }

    static internal(message) {
        return new ApiError(500, message)
    }


}

export default ApiError