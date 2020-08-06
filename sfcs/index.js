'use strict'
// Import all dependencies & middleware here
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const bodyParser = require('body-parser');

const session = require('express-session')({
  secret: 'TranDucBinhIsAuthorOfThisProject1593145874231',
  resave: true,
  saveUninitialized: true
});
const sharedSession = require('express-socket.io-session');
// Attach session
app.use(session);

// Share session with io socket
io.use(sharedSession(session, {
  autoSave: true
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'presentation'));

// Use your dependencies here
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// use all controllers(APIs) here
function renderPage(req, res, page, title,
  checkLogin, checkLogout) {
  const userData = req.session.userData || {};
  if ((checkLogin && req.session.loggedin) ||
    (checkLogout && !req.session.loggedin)) {
    return res.redirect('/');
  }
  var userTypeText = '';
  switch (userData.UserType) {
    case 0:
      userTypeText = 'Khách hàng';
      break;
    case 1:
      userTypeText = 'Đầu bếp';
      break;
    case 2:
      userTypeText = 'Chủ cửa hàng';
      break;
    case 3:
      userTypeText = 'Quản lý';
      break;
    case 4:
      userTypeText = 'Tiếp tân';
      break;
  }
  res.render('index', {
    page: page,
    option: req.query.option,
    title: title,
    userData: userData,
    loggedin: req.session.loggedin,
    userTypeText: userTypeText
  });
}
// Get field
app.get('/', function (req, res) {
  renderPage(req, res, 'home', 'Trang chủ', false, false);
});
app.get('/login', function (req, res) {
  renderPage(req, res, 'login', 'Đăng nhập', true, false);
});
app.get('/register', function (req, res) {
  renderPage(req, res, 'register', 'Đăng ký tài khoản', true, false);
});
app.get('/dashboard', function (req, res) {
  renderPage(req, res, 'dashboard/index', 'Bảng điều khiển', false, true);
});
app.get('/about', function (req, res) {
  renderPage(req, res, 'about', 'Về chúng tôi', false, false);
});
// Post field

// use io
io.on('connection', function (socket) {
  if (socket.handshake.session.id) {
    socket.join('SessionID' +
      socket.handshake.session.id);
  }
  if (socket.handshake.session.loggedin) {
    let userData = socket.handshake.session.userData;
    socket.join('UserID' + userData.UserID);
    if (userData.UserType === 1) {
      socket.join('StallCook' + userData.OwnerID);
    }
  }
  require('./io-controller/user.io').userIo(socket, io);
  require('./io-controller/food.io').foodIo(socket, io);
  require('./io-controller/cart.io').cartIo(socket, io);
  require('./io-controller/order.io').orderIo(socket, io);
});

module.exports = server;