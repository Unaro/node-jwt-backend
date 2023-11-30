import { Router } from 'express'
import userRouter from './user-router.js'
import activityRouter from './activity-router.js'
import achievementsRouter from './achievements-router.js'
import CInfo from '../middleware/client-info.middleware.js'
import authHandling from '../middleware/authHandling.moddleware.js'
import roleRouter from './role-router.js'
import statisticRouter from './statistic-router.js'
import raitingRouter from './raiting-router.js'

const router = new Router()

router.use('/users', userRouter)
router.get('/', authHandling.isAdmin,  (req, res) => {return res.json({message: "тестовое сообщение!"})})
router.use('/activity', activityRouter)
router.use('/achievements', achievementsRouter)
router.use('/roles', roleRouter)
router.use('/statistic', statisticRouter)
router.use('/raiting', raitingRouter)

export default router