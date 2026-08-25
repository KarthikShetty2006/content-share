const mongoose=require('mongoose')
const saveSchema=new mongoose.Schema({
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
    }
)
saveSchema.index(
  { foodPartner: 1, food: 1 },
  { unique: true }
);
const saveModel=mongoose.model('save',saveSchema)
module.exports=saveModel