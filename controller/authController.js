const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const {path} = require('dotenv');


const signToken = id=>{
    return jwt.sign({id} , process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRES_IN
    });
}
exports.signUp = catchAsync(async(req , res, next)=>{
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(200).json({
        status : 'sucess',
        token,
        data : {
            user : newUser
        }
    })
})

exports.login = catchAsync(async(req , res , next)=>{
    const {email,password} = req.body;

    // Checking wether the user exist or not
    if(!email && !password){
        return(next(new AppError('Please provide both email and password' , 404)))
    };
    // Checking if password is correct or not , email is correct or not
    const user = await User.findOne({email});
    if(!user && !(await user.checkPassword(password , user.password)) ){
        return next( new AppError ('Incorrect email or password !' , 401))
    }
    console.log(user);
    // If everything OK , send token to client
    const token  = signToken(user._id);

    res.status(200).json({
        status : 'sucess',
        token
    })
});

exports.protect = catchAsync( async (req , res  , next)=>{
    let token;
    if( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
        token = req.headers.authorization.split(' ')[1];
    };
    
    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access' , 401))
    }

    // 2.) Verification Token
     const decoded = await promisify (jwt.verify)(token , process.env.JWT_SECRET);
      console.log(decoded);

    // 3) Checking if user still exist or not
    const currentUser = await User.findById(decoded.id)

      if(!currentUser){
      return next(new AppError('The user belonging to this token does not exist' , 401));
     };

    // 4) Check if user changed the password after the token was issued
    // if(currentUser.changedPasswordAfter(decoded.iat)){
    //    return next(new AppError('User currently changed the password! please log in again' , 401));
    // };

    // Since data transferred from one middleware to other in form of req
    req.user = currentUser;
    next();
});


exports.restrictTo = (req,res,next)=>{
    if(!req.user.isAdmin){
        return next(new AppError('Only admin is allowed' , 403));
    }
    next();
}

