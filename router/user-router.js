import { Router } from 'express'
import UserController from '../controllers/user-controller.js'
import { body } from 'express-validator'
import authHandling from '../middleware/authHandling.moddleware.js'

const router = new Router()

router.get('/', UserController.welcome)

router.post('/login', UserController.login)
router.delete('/logout', UserController.logout)
router.get('/refresh', UserController.refresh)

router.post('/registration', UserController.create)

router.get('/view', UserController.getUsers)
router.get('/view/:id', UserController.getOneUser)

export default router