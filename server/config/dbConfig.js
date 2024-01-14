 const mongoose =require('mongoose')

 mongoose.connect(process.env.mongo_url)

 const connection=mongoose.connection;

 connection.on('connected',()=>{
    console.log('mongodb connection success full')
 })
 connection.on('err0or',()=>{
    console.log('mongodb connection fall')
 })