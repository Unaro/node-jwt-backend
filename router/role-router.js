import { Router } from 'express'
import roleController from '../controllers/role-controller.js'

const router = new Router()

//в ходе разработки

router.get('/', roleController.GetRoles)
router.get('/:roleId', roleController.GetRoleByPK)
router.get('/user/:userId', roleController.GetUserRoles)

router.post('/', roleController.CreateRole)
router.delete('/delete', roleController.DeleteRole)
router.put('/update', roleController.Update)

router.post('/AddRoleToUser', roleController.AddRoleToUser)
router.post('/RemoveRoleToUser', roleController.RemoveRoleToUser)

export default router