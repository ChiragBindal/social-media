const express = require('express');
const AppError = require('./utils/appError');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Implimenting middleware
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//Routing
app.use('/api/v1/user' , userRoute);
app.use('/api/v1/posts' , postRoute)


// Handling GlobaError
app.use('*' , (req , res , next)=>{
    next(new AppError(`Cann't find ${req.originalUrl} on this server !` , 404));
})

//exporting
module.exports = app;