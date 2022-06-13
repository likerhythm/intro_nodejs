const Sequelize = require('sequelize');
// env(환경) 설정 - 개발/테스트/배포
const env = process.env.NODE_ENV || 'development';
// 설정한 env에 해당하는 설정값들을 config.json 파일에서 가져옴
const config = require('../config/config')[env];
// 모델 가져오기
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');

const db = {};
// config.json에서 가져온 설정들로 시퀄라이즈 객체 생성
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

// db 객체에 시퀄라이즈와 모델 객체 넣기
db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

// 시퀄라이즈 객체를 인수전달하여 모델 설정
User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

// db 객체를 인수전달하여 관계 설정
User.associate(db);
Post.associate(db);
Hashtag.associate(db);

module.exports = db;