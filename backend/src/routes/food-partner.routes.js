const express=require('express')
const router=express.Router()
const foodPartnerController=require('../controller/food-partner.controller')
const authMiddleware=require('../middlewares/auth.middlewares')

//get /api/food-partner/:id
router.get('/:id',authMiddleware.authUserMiddleware,foodPartnerController.getFoodPartnerById)   

module.exports=router