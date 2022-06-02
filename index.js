const express = require('express');
const mongoose = require('mongoose');
const path = require("path");

// import Routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

const app = express();
const cors = require('cors');   



app.use('/csv',express.static(__dirname+'/csv'));                   // for public view


require('dotenv').config();
app.use(express.json());
app.use(cors());

//routes
app.use('/auth',authRoutes);
app.use('/contact',contactRoutes);

// error handler
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.status || 500;
    const message = error.message||"Unknown Server Error";
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

// connect to data base
mongoose.connect(process.env.DB,()=>{
    console.log('connected');
    app.listen(process.env.PORT);
});
