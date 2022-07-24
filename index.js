const express = require('express'); //모듈 가져오기
const app = express(); //앱을 변수에 담기
const port = 5000
const bodyParser = require('body-parser');
const config = require('./config/key');
const { User } = require("./models/User"); //User.js를 import

//최신 express에는 기본적으로 포함되어 body-parser 설치할 필요 없음 아래 코드 추가
//app.use(express.json());
//app.use(express.urlencoded({extended: true}));

//application/x-www-form-urlencoded 를 분석하기 위함
app.use(bodyParser.urlencoded({extended: true})); 

//application/json 을 분석하기 위함
app.use(bodyParser.json());

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
  console.log(req.body); //  express + body-parser 모듈을 이용해서  req.body를 받을수 있게된것
  user.save((err, userInfo) => {
    console.log(userInfo);
    if(err) return res.json({ success: false, err});
    return res.status(200).json({
      success: true
    })
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})