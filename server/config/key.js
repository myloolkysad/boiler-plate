if (process.env.NODE_ENV === 'production') { //프로세스 환경이 운영이면 운영파일을 읽고
    module.exports = require('./prod');
} else { //프로세스 환경이 개발이면 개발파일을 읽음. (mongo DB 계정정보)
    module.exports = require('./dev');
}