import { Router } from 'express'
import UserController from '../controllers/user-controller.js'
import { body } from 'express-validator'
import authHandling from '../middleware/authHandling.moddleware.js'

const router = new Router()

router.get('/', UserController.getUsers)
router.post('/', authHandling.isStudent, UserController.create)
router.delete('/', authHandling.isAdmin, UserController.delete)
router.put('/', authHandling.isUser, UserController.update)
router.post('/weight', UserController.updateIMT)


router.post('/login', UserController.login)
router.delete('/logout', UserController.logout)
router.get('/refresh', UserController.refresh)

router.get('/view', UserController.getUsers)

router.get('/user/:userIdOrLogin', UserController.getOneUser)

export default router