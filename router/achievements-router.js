import { Router } from 'express'
import achievementsController from '../controllers/achievements-controller.js'
const router = new Router()

//в ходе разработки

router.get('/', achievementsController.getAll)
// router.get('/:achievementId', achievementsController.getAll)
// router.get('/user/:userId', achievementsController.getAll)

// router.post('/create', achievementsController.getAll)
// router.delete('/delete', achievementsController.getAll)
// router.put('/update', achievementsController.getAll)

export default router