import { Router } from 'express'
import ActivityController from '../controllers/activity-controller.js'

const router = new Router()

//Не реализовано полноценно

router.get('/', ActivityController.getAll)

router.get('/user/:userId', ActivityController.getUserActivity)
router.get('/:activityId', ActivityController.getActivity)

router.post('/createSport', ActivityController.createTypeSport)
router.post('/createTypeActivity', ActivityController.createTypeActivity)
router.post('/createActivity', ActivityController.create)
router.put('/:activityId/checkout', ActivityController.checkoutStatistic)

router.put('/update', ActivityController.updateActivity)

router.delete('/delete/sport/:sportId', ActivityController.deleteTypeSport)
router.delete('/delete/type/:typeActivityId', ActivityController.deleteTypeActivity)
router.delete('/delete/:activityId', ActivityController.deleteActivity)

export default router