const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
const pageRouter = require('./routes/page');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
// 패스포트 설정
passportConfig();
app.set('port', process.env.PORT||3000);
app.set('view engine', 'html');
// 넌적스 파일들 위치 및 옵션 설정
// 위치: views 폴더
nunjucks.configure('views', {
	express: app,
	watch: true,
});

// 서버 실행 시 mysql 연동
// force: true이면 서버 실행 할 때마다 테이블 재생성
sequelize.sync({ force: false})
	.then(() => {
		console.log('데이터베이스 연결 성공');
   })
	.catch((err) => {
		console.error(err);
});

// morgan dev 버전 사용
app.use(morgan('dev'));
// 모든 요청에 대해 public 폴더 내의 파일 제공
app.use(express.static(path.join(__dirname, 'public')));
// http 모듈에서 body를 스트림으로 받아서 함친 과정을 수행
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
//
app.use(cookieParser(process.env.COOKIE_SECRET));

//session 설정(express-session 패키지)
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: process.env.COOKIE_SECRET,
	cookie: {
		httpOnly: true,
		secure: false,
	},
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);

app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = process.env.NODE_ENV !== 'production' ? err: {};
	res.status(err.status || 500);
	res.render('error');
});

app.listen(app.get('port'), () => {
	console.log(app.get('port'), '번 포트에서 대기 중');
});