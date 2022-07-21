// 라우터

const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

// 사용자 정보 불러오기
router.use((req, res, next) => {
	req.locals.user = req.user;
	res.locals.user = null;
	res.locals.followerCount = 0;
	res.locals.followingCount = 0;
	res.locals.followerIdList = [];
	next();
});

router.get('/profile', isLoggedIn, (req, res) => {
	res.render('profile', { title: '내 정보 - NodeBird'});
});

router.get('/join', isNotLoggedIn, (req, res) => {
	res.render('join', { title: '회원가입 - NodeBird'});
});

router.get('/', (req, res, next) => {
	const twits = [];
	res.render('main', {
		title: 'NodeBird',
		twits,
	});
});

module.exports = router;