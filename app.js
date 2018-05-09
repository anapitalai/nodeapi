const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

//mongodb
//mongoose.connect('mongodb://anapitalai:noGoZone@nictc-shard-00-00-ok4ic.mongodb.net:27017,nictc-shard-00-01-ok4ic.mongodb.net:27017,nictc-shard-00-02-ok4ic.mongodb.net:27017/test?ssl=true&replicaSet=nictc-shard-0&authSource=admin');
mongoose.connect('mongodb://localhost:27017/api');
//morgan
app.use(morgan("dev"));
app.use('/uploads',express.static('uploads'));
//bParser

app.use(bodyParser.json({limit:'50mb'}));

app.use(bodyParser.urlencoded({extended:false,limit:'50mb'}));


//cors
app.use((req,res,next)=>{
 res.header("Access-Control-Allow-Origin","*");
 res.header("Access-Control-Allow-Headers",
 "Origin,X-Requested-With,Content-Type,Accept,Authorization");
 if (req.method === "OPTIONS"){
     res.header("Access-Control-Allow-Methods",
     "PUT,GET,POST,PATCH,DELETE");
     return res.status(200).json({});
 }
 next();
});

//routes
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);

//middleware for error handling
app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status=404;
    next(error);
});

app.use((error,req,res,next)=>{
res.status(error.status || 500);
res.json({
    error:{
        message:error.message
    }
});
});

module.exports = app;

