const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next) {
    console.log('스키마 저장~ ');
    var user = this;
    if(user.isModified('password')) {
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        }) 
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) { 
            return callback(err);
        } else {
            callback(null, isMatch);
        }
    })
}

userSchema.methods.generateToken = function (callback) {
    var user = this;
    //jsonwebtoken을 이용해서 토큰을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function(err, user) {
        if (err) { return callback(err); }
        callback(null, user); 
    });
}

userSchema.statics.findByToken = function ( token, callback) {
    var user = this;

    //토큰을 디코드
    jwt.verify (token, 'secretToken', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 토큰과 디비 토큰 일치 여부 확인
        user.findOne({"_id": decoded, "token": token}, function (err, user) {
            if(err) { return callback(err); }
            else { callback(null, user)}
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }