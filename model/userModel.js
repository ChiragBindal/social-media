const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : [true , 'A user must have name']
    },
    email : {
        type : String,
        required : [true , 'Please provide your email'],
        unique : true,
        validate  : [validator.isEmail , 'Please provide valid email']
    },
    profilephoto : {
        type : String,
        default : ''
    },
    coverphoto : {
        type : String,
        default : ''
    },
    password : {
        type : String,
        minlength : 8,
        required : [true , 'Please provide password !']
    },
    passwordConfirm : {
        type : String,
        required : [true , 'Please conform your password !'],
        validate : {
            validator : function(el){
                return el === this.password
            }
        },
        message : 'Password not same'
    },
    followings : {
        type : Array,
        default : []
    },
    followers : {
        type : Array,
        default : []
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    passwordChangedAt : Date,
    desc : {
        type : String,
        max : 50
    },
    city : {
        type : String,
        max : 50
    },
    from : {
        type : String,
        max : 50
    },
    relationship : {
        type : Number,
        enum : [1,2,3]
    },
    active : {
        type : Boolean,
        default : true,
        select : false
    }
});

userSchema.pre('save' , async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password , 12);
    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save' , function(next){
    if(! this.isModified('password') || this.isNew) {return next()};

    this.passwordChangedAt = Date.now() - 1000;
    next();
});
userSchema.pre('/^find/' , function(next){
    this.find({active : {$ne : false}})
    next();
});

userSchema.methods.checkPassword = async function(candidatePassword , userPassword){
    return await bcrypt.compare(candidatePassword , userPassword)
};


userSchema.methods.changedPasswordAfter = async function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000 ,10 );

        console.log(changedTimestamp , JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }

    return false;
};




const User = mongoose.model('User' , userSchema);

module.exports = User;