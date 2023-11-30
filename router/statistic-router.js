import { Router } from 'express'
import statisticController from '../controllers/statistic-controller.js'
import AuthHandling from '../middleware/authHandling.moddleware.js'

const router = new Router()

//в ходе разработки

router.get('/', statisticController.getAll)

router.post('/create', AuthHandling.isAdmin, statisticController.getAll)
router.put('/update', AuthHandling.isAdmin, statisticController.getAll)
router.delete('/delete', AuthHandling.isAdmin, statisticController.getAll)

router.get('/:statisticId', AuthHandling.isAdmin, statisticController.getAll)
router.get('/user/:userId', statisticController.getAll)

router.post('/addToUserById', AuthHandling.isUser, statisticController.addStatisticToUserById)


export default router