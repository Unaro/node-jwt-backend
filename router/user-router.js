import { Router } from 'express'
import UserController from '../controllers/user-controller.js'
import { body } from 'express-validator'
import authHandling from '../middleware/authHandling.moddleware.js'

const router = new Router()

router.get('/', UserController.getUsers)
router.post('/', UserController.create)
router.delete('/', UserController.delete)
router.put('/', UserController.update)

router.post('/login', UserController.login)
router.delete('/logout', UserController.logout)
router.get('/refresh', UserController.refresh)



router.get('/view', UserController.getUsers)

router.get('/view/:userIdOrLogin', UserController.getOneUser)
export default router