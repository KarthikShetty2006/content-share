const mongoose=require('mongoose')

const likeSchema=new mongoose.Schema({
    foodPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'foodpartner',
        required:true 
    },
    food:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'food',
        required:true
    }
},{
    timestamps:true
})
likeSchema.index(
  { foodPartner: 1, food: 1 },
  { unique: true }
);
const likeModel=mongoose.model('like',likeSchema)
module.exports=likeModel;