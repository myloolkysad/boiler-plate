const express = require('express') //모듈 가져오기
const app = express() //앱을 변수에 담기
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://qweiopop:qweiopop@cluster0.zaocj2d.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true //, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('MongoDB Connected...'))
  .catch(err => console.log(err)) //몽구스 사용


app.get('/', (req, res) => {
  res.send('안녕하세요~') //문구 출력
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})