import dotenv from "dotenv";
import connectDB from "./db/index.js"
dotenv.config({path:"./env"});

connectDB()
.then(()=>{
  app.listen(process.env.PORT||8000);
  console.log(`server is runnning on Port ${process.env.PORT}`);
})
.catch((err)=>{
   console.log(`MongoDB connection failed ${err}`);
})
/*import express from "express";
const app = express();
(async()=>{
  try{
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("ERROR",(error)=>{
      console.log("ERR :",error);
      throw error
    })
    app.listen(process.env.PORT,()=>{
      console.log(`app is listening on ${process.env.PORT}`)
    })
  }
  catch(error){
      console.log("ERROR:",error);
  }
})()
  */