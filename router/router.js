import { Router } from 'express'
import userRouter from './user-router.js'
import activityRouter from './activity-router.js'
import CInfo from '../middleware/client-info.middleware.js'

const router = new Router()

router.use('/users', CInfo.show, userRouter)
router.get('/', (req, res) => {return res.json({message: "тестовое сообщение!"})})
router.use('/activity', activityRouter)

export default router