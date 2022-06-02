const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const app = express();




app.use( "/csv",express.static(path.join(__dirname, 'csv')));



require('dotenv').config();
// app.use(fileup())        
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
