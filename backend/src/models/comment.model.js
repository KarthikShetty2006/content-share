const mongoose=require('mongoose')
const commentSchema=new mongoose.Schema({
     foodPartner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'foodpartner',
            required:true 
        },
        food:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'food',
            required:true
            },
        comment:{
            type:String,
            required:true
        }
})
const commentModel=mongoose.model('comment',commentSchema)
module.exports=commentModel