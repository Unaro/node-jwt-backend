import ApiError from "../error/ApiError.js"

export default (err, req, res, next) => {
    console.log(err)
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }

    return res.status(503).json({message: err.message || "непредвиденная ошибка!", errors: err.errors})
}