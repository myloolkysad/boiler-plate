const { User } = require('../models/User');

let auth = (req, res, next) => {
    //인증처리를 하는 곳
    console.log('유저인증처리');
    //클라이언트 쿠키에서 토큰을 가져온다
    let token = req.cookies.x_auth;

    //토큰을 복호화 한 뒤 유저를 찾는다
    User.findByToken(token, (err, user) => {
        if(err) {
             throw err;
        }
        if(!user) {
            return res.json({ isAuth: false, error: true});
        } 
        req.token = token;
        req.user = user;
        next();
    })
    //유저 있음
    //유저 없음
}

module.exports = { auth };