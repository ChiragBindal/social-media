const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Post = require('../model/postModel');

// Create a post
exports.createPost = catchAsync ( async (req ,res , next)=>{
    const newPost = await Post.create(req.body);

    res.status(200).json({
        status : 'success',
        data : {
            post : newPost
        }
    })
});
// Update a post
exports.updatePost = catchAsync(async(req , res, next)=>{
    const post = await Post.findById(req.params.id);

    // 1.) Check whether the user is updating its own post
    if(req.user.id === post.userId){
        const updatedPost = await Post.updateOne(req.body);
         console.log(updatedPost);
    }else{
        return next(new AppError('You can update your post only' , 403));
    };

    // 2.) Giving response
    res.status(200).json({
        status : 'success'
    })
});
// delete a post 
exports.deletePost = catchAsync(async(req , res, next)=>{
    const post = await Post.findById(req.params.id);
    let deleteddPost ; 
    // 1.) Check whether the user is updating its own post
    if(req.user.id === post.userId){
         deleteddPost = await Post.deleteOne();
    }else{
        return next(new AppError('You can delete your post only' , 403));
    }

    res.status(200).json({
        status : 'success',
        data : null
        
    })
});
// Like a post
exports.likePost = catchAsync(async(req , res, next)=>{
    const post = await Post.findById(req.params.id);
    let a = req.user.id;
    if(!post.like.includes(a)){
        const likedPost = await Post.updateOne({$push : {like : {a}}});
    }else{
        const dislikedPost = await Post.updateOne({$pull : {like : {a}}});
    };

    res.status(200).json({
        status : 'success'
    });
})

// get a post 
exports.getPost = catchAsync(async(req , res, next)=>{
    const post = await Post.find(req.params.id);

    res.status(200).json({
        status : 'success',
        data : {
            post
        }
    })
})

// get timeline posts
exports.timeline = catchAsync(async(req , res, next)=>{
    let currentUser = req.user;
    let currentUserId = currentUser.id;
    const post = await Post.findOne(currentUserId);
    const friendPost = await Promise.all(
        currentUser.followings.map((friensId)=>{
            Post.find({userId : friensId});
        })
    )
    res.status(200).json(post.concat(...friendPost));
})