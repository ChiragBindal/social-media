const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUser = catchAsync( async (req , res , next)=>{
    const users = await User.find();

    res.status(200).json({
        status : 'success',
        data : {
            user : users
        }
    })
});

exports.getUser = catchAsync(async(req , res, next)=>{
    const user = await User.findById(req.params.id);

    res.status(200).json({
        status : 'success',
        data : {
            user
        }
    })
})

exports.deleteUser = catchAsync(async(req , res, next)=>{
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status : 'success',
        data : null
    })
})

exports.updateMe = catchAsync(async(req , res , next)=>{
    // 1.) Create error if user post password
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This route is not for password updates' , 400));
    };

    // 2.) Update user document
     const updatedUser = await User.findByIdAndUpdate(req.user.id , req.body , {
        new : true,
        runValidators : true
    });

    // 3.) If everything is OK, then
    res.status(200).json({
        status : 'succes',
        data : {
           user : updatedUser
        }
    })
})

exports.deleteMe = catchAsync ( async (req , res, next)=>{
    await User.findByIdAndUpdate(req.user.id , {active : false});

    res.status(200).json({
        status : 'success',
        data : null
    })
});

exports.follow = catchAsync(async(req , res, next)=>{
    
})