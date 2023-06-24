import { Router } from 'express'
import UserController from '../controllers/user-controller.js'
import { body } from 'express-validator'


const router = new Router()

router.get('/', UserController.welcome)

router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.get('/refresh', UserController.refresh)

router.post('/create', UserController.create)
router.delete('/delete', UserController.delete)

router.get('/view', UserController.getUsers)
router.get('/view/:id', UserController.getUsers)

export default router