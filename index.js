const express = require('express'); //모듈 가져오기
const app = express(); //앱을 변수에 담기
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User"); //User.js를 import

//최신 express에는 기본적으로 포함되어 body-parser 설치할 필요 없음 아래 코드 추가
//app.use(express.json());
//app.use(express.urlencoded({extended: true}));

//application/x-www-form-urlencoded 를 분석하기 위함
app.use(bodyParser.urlencoded({extended: true})); 

//application/json 을 분석하기 위함
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
//mongoose.connect('', 'mongodb+srv://qweiopop:qweiopop@cluster0.zaocj2d.mongodb.net/?retryWrites=true&w=majority', {
//    useNewUrlParser: true, useUnifiedTopology: true //, useCreateIndex: true, useFindAndModify: false
//}).then(()=> console.log('MongoDB Connected...'))
//  .catch(err => console.log(err)) //몽구스 사용
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true //, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('MongoDB Connected...'))
  .catch(err => console.log(err)) //몽구스 사용  


app.get('/', (req, res) => { // get 메소드 사용
  res.send('안녕하세요~111') //문구 출력
})

//회원가입을 위한 라우터 //라우터가 노드js에서는 컨트롤러 느낌?
app.post('/register', (req, res) => { //post 메소드 사용
  //회원가입 할 대 필요한 정보들을 클라이언트에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body); //User.js 객체화
  console.log('요청바디~ ' + req.body); //  express + body-parser 모듈을 이용해서  req.body를 받을수 있게된것
  user.save((err, userInfo) => {
    console.log('save의 유저정보~ ' + userInfo);
    if(err) return res.json({ success: false, err});
    return res.status(200).json({
      success: true
    })
  });
});

app.post('/api/users/login', (req, res) => {
  console.log('로그인 요청');
  //요청된 이메일을 데이터베이스에 있는지 찾는다.
  User.findOne({ email: req.body.email}, (err, user) => {
    if (!user) {
        console.log("유저확인");
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다."
        });
    };
     //요청된 이메일이 데이터 베이스에 있다면 비밀번호 맞느지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
        if(!isMatch) {
          console.log("데이터확인");
          return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});
        };

        // 비밀번호까지 맞다면 토큰 생성.
        user.generateToken((err, user) => {
          console.log("토큰확인");
            if (err) { return res.status(400).send(err); }
            
            //토큰을 저장한다.
            res.cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id});
        });
    });

  });
})

app.get('/api/users/auth', auth, (req, res) => {
    console.log('인증과정~ ' + req);
    console.log('인증과정2~ ' + req.user);
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id}, 
      {token: ""},
      (err, user) => {
        if(err) {return res.json({success: false, err});}
        else {
          return res.status(200).send({
            success: true
          })
        }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})