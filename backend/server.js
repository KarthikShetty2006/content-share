require('dotenv').config()
const app=require('./src/app')
const connectDB=require('./src/db/db')

connectDB()
app.listen(3000,()=>{require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Server could not start:", error.message);
    process.exit(1);
  });
    console.log('it runs')
})