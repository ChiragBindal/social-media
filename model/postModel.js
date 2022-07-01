const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : [true , 'It must contain userId']
    },
    desc : {
        type : String,
        max : 500
    },
    img : {
        type : String
    },
    like : {
        type : Array,
        default : []
    }
},{timestamps : true});

const Post = mongoose.model('Post' , postSchema);

module.exports = Post;