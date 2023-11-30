import { Router } from 'express'
import raitingController from '../controllers/raiting-controller.js' 

const router = new Router()

router.get('/', raitingController.GetAll)
router.get('/user', raitingController.GetProfileRaiting)
export default router