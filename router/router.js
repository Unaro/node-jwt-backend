import { Router } from 'express'
import userRouter from './user-router.js'
import activityRouter from './activity-router.js'
import CMiddle from '../middleware/customMiddleware.js'

const router = new Router()

router.use('/users', CMiddle.middle, userRouter)
router.use('/activity', activityRouter)

export default router