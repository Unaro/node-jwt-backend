import sequelize from './db.js'
import models from './models/user-model.js'
import cors from 'cors'
import express, { Router } from 'express'
import cookieParser from 'cookie-parser'
import router from './router/router.js'
import dotenv from 'dotenv'
import errorHandler from './middleware/errorHandlingMiddleware.js'
dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use('/api', router)

app.use(errorHandler)


const promiseStart = new Promise((resolve, reject) => {
    sequelize.authenticate()
    .then(
        () => {
            sequelize.sync()
            resolve({message: `server connected to DB dev-backend`})
        })
    .catch(
        (e) => reject(new Error("DB connect failed"))
    )
})

promiseStart
.then(data => {
    console.log(`${data.message}`)
    app.listen(PORT, () => console.log(`server started on ${PORT}`))
})
.catch(e => {
    console.log(`${e}`)
})