const express = require("express");
const app = express();
app.use(express.json());
const port = process.env.port || 5000;
require("dotenv").config();
const dbConfig = require("./config/dbConfig");

const usersRoute = require("./routes/userRoutes");
const productsRoute = require("./routes/productsRoute");
const bidsRoute = require("./routes/bidsRoute");
const notificationsRoute = require("./routes/notificationsRoutes");

app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/bids", bidsRoute);
app.use("/api/notifications", notificationsRoute);


// deployment 
const path=require("path");
__dirname =path.resolve();

// render deployment 
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"/client/build")));
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"client","build","index.html"));
    });
}



app.listen(port, () => console.log(`node server on port ${port}`));

// WJv9ulbZkSCHDF4h
