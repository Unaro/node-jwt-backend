import { Router } from 'express'
import ActivityController from '../controllers/activity-controller.js'

const router = new Router()

//Не реализовано полноценно

router.get('/', ActivityController.getAll)

router.get('/view/:userId', ActivityController.getUserActivity)
router.get('/:activityId', ActivityController.getActivity)

router.post('/create', ActivityController.getAll)
router.put('/update', ActivityController.getAll)

router.delete('/delete', ActivityController.getAll)

export default router