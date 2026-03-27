const mongoose=require('mongoose')

function connectDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log('mongodb connected')
    })
    .catch(()=>{
        console.log("cannot connect to db:",error)
    })
}

module.exports=connectDB;