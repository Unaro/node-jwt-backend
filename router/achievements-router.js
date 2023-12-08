import { Router } from 'express'
import achievementsController from '../controllers/achievements-controller.js'
import AuthHandling from '../middleware/authHandling.moddleware.js'
const router = new Router()

//в ходе разработки

router.get('/', achievementsController.getAll)
// router.get('/:achievementId', achievementsController.getAll)
router.get('/user', AuthHandling.isUser, achievementsController.getUserAchievements)

// router.post('/create', achievementsController.getAll)
// router.delete('/delete', achievementsController.getAll)
// router.put('/update', achievementsController.getAll)

export default router