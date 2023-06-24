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

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static forbidden(message) {
        return new ApiError(403, message)
    }

    static internal(message) {
        return new ApiError(500, message)
    }


}

export default ApiError