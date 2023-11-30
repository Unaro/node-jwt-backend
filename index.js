import sequelize from './db.js'
import models from './models/main-model.js'
import cors from 'cors'
import express, { Router } from 'express'
import cookieParser from 'cookie-parser'
import router from './router/router.js'
import dotenv from 'dotenv'
import errorHandler from './middleware/errorHandling.middleware.js'
import onServerInit from './service/sever_init/onServerInit.js'
import AuthHandling from './middleware/authHandling.moddleware.js'
import statisticEventHandler from './service/event_handlers/statisticEventHandler.js'



dotenv.config()
const processId = process.pid
const PORT = process.env.PORT || 5000
const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use(AuthHandling.getUserInfo)
app.use('/api', router)
app.use(errorHandler)


const promiseStart = new Promise((resolve, reject) => {
    sequelize.authenticate()
    .then(
        async () => {
            await sequelize.sync({ force: false })

            resolve({message: `server connected and sync to DB ${process.env.DATABASE}`})
        })
    .catch(
        (e) => reject(new Error("DB connect failed"))
    )
})

promiseStart
.then(data => {
    console.log(`${data.message}`)
    onServerInit.AddBaseParams()
    onServerInit.AddBaseRoles()
    onServerInit.AddBaseAchievements()
    app.listen(PORT, () => console.log(`server started on ${PORT} and process ${processId}`))
})
.catch(e => {
    return console.log(`${e}`)
})