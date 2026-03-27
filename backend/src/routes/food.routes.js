const express=require('express')
const router=express.Router()
const foodController=require('../controller/food.controller')
const authMiddleware=require('../middlewares/auth.middlewares')
const multer=require('multer')
const { route } = require('./auth.routes')
const upload=multer({
    storage:multer.memoryStorage() 
})

router.post('/',authMiddleware.authFoodPartnerMiddleware,upload.single("video"),foodController.createFood)
router.get('/',authMiddleware.authUserMiddleware,foodController.getFoodItems)

router.post('/like',authMiddleware.authUserMiddleware,foodController.likeFood)
router.post('/save',authMiddleware.authUserMiddleware,foodController.saveFood)
router.post('/comment',authMiddleware.authUserMiddleware,foodController.addComment)

router.get('/saved',authMiddleware.authUserMiddleware,foodController.getSavedFoodItems)
router.get('/comments/:foodId',authMiddleware.authUserMiddleware,foodController.getComments)

module.exports=router