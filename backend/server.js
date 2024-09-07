//!Import Packages
const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const app = express();
const cors = require("cors");
const dotenv = require('dotenv');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const db = require('./config/db');


//!Middlewares
// Middleware to access data from clint in JSON formate
app.use(express.json())

// Middleware for cross origin error
app.use(cors({
  origin:[],
  origin:["GET","PUT","DELETE","POST"],
  credentials:true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Middleware which tells us API method , status code and time taken by API
app.use(morgan('dev'));

// route
// URL => http://localhost:4000
app.use('/api/v1/auth',require('./routes/authRoutes'))

app.get('/',(req,res)=>{
  return res.status(200).json("Welcon to food server");
}) 


const PORT  = process.env.PORT || 4000;

// Start the server and listen for connections on port 3000
app.listen(PORT,()=>{
  console.log(`Server running on PORT : ${PORT}`.bgCyan);
})