'use strict'
// Import all dependencies & middleware here
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const bodyParser = require('body-parser');

const Utilities = require('./utilities');
const UserController = require('./user/user.controller');
const CustomerController = require('./customer/customer.controller');
const FoodController = require('./food/food.controller');
const CartController = require('./cart/cart.controller');

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
  autoSave:true
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use your dependencies here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// use all controllers(APIs) here
// Get field
app.get('/', UserController.controlHomepage);
app.get('/login', Utilities.needLogoutGet,
    UserController.controlLogin);
app.get('/register', Utilities.needLogoutGet,
    CustomerController.controlRegister);
app.get('/about', UserController.controlAbout);
app.get('/cart', Utilities.needLogin, CartController.controlCart);
// Post field

// global error handler
app.use(Utilities.errorHandler);

// global variable to control busy
let isBusy = {};
let seIsBusy = {};

// use io
io.on('connection', function(socket){
  if (socket.handshake.session.id) socket.join('SessionID' + socket.handshake.session.id);
  if (socket.handshake.session.loggedin) {
    socket.join('UserID' + socket.handshake.session.userData.UserID);
  }
  socket.on('clientSendLogout', function(){
	  if (socket.handshake.session.loggedin) {
      delete socket.handshake.session.loggedin;
      delete socket.handshake.session.userData;
      socket.handshake.session.save();
    }
    io.sockets.in('SessionID' + socket.handshake.session.id).emit('serverSendRedirect');
  });
  socket.on('clientSendAuthenticate', function(data){
    if (socket.handshake.session.loggedin) {
      socket.emit('serverSendRedirect');
      return;
    }
    var checkData = Utilities.validateAccount(data);
    if (checkData.checkFail) {
      socket.emit('serverSendFail', checkData);
      return;
    }
    UserController.authenticate(data, function(user){
      if (user && user.checkAuthFail) {
        socket.emit('serverSendFail', user);
        return;
      }
      socket.handshake.session.loggedin = true;
      socket.handshake.session.userData = user;
      socket.handshake.session.save();
      io.sockets.in('SessionID' + socket.handshake.session.id).emit('serverSendRedirect');
    });
  });
  socket.on('clientSendRegister', function(data){
    if (socket.handshake.session.loggedin) {
      socket.emit('serverSendRedirect');
      return;
    }
    let sessionId = socket.handshake.session.id;
    if (seIsBusy[sessionId]) {
      socket.emit('serverSendFail', {message: 'Hệ thống đang bận vui lòng thử lại sau'});
      return;
    }
    seIsBusy[sessionId] = true;
    var checkData = Utilities.validateRegister(data);
    if (checkData.checkFail) {
      delete seIsBusy[sessionId];
      socket.emit('serverSendFail', checkData);
      return;
    }
    var checkData2 = Utilities.validateAccount(data);
    if (checkData2.checkFail) {
      delete seIsBusy[sessionId];
      socket.emit('serverSendFail', checkData2);
      return;
    }
    CustomerController.registerCustomer(data, function(err){
      if (err) {
        delete seIsBusy[sessionId];
        socket.emit('serverSendFail', err);
        return;
      }
      delete seIsBusy[sessionId];
      socket.emit('serverSendRedirect');
    });
  });
  socket.on('clientGetListFood', function(){
    FoodController.getListFood(function(err, foods){
      if (err) {
        socket.emit('serverSendFail', err);
      } else {
        socket.emit('serverSendListFood', foods);
      }
    })
  });
  socket.on('clientGetNumCartToPay', function() {
    if (socket.handshake.session.loggedin) {
      CartController.getNumCartToPayByUserId(socket.handshake.session.userData.UserID, function(err, numCartToPay){
        if (err) {
          socket.emit('serverSendFail', err);
        } else {
          socket.emit('serverSendNumCartToPay', numCartToPay);
        }
      });
    }
  });
  socket.on('clientAddToCart', function(foodId){
    if (socket.handshake.session.loggedin){
      let userId = socket.handshake.session.userData.UserID;
      if (isBusy[userId]) {
        socket.emit('serverSendFail', {message: 'Hệ thống đang bận vui lòng thử lại sau'});
        return;
      }
      let data = {};
      data.foodId = parseInt(foodId);
      data.customerId = socket.handshake.session.userData.UserID;
      CartController.addToCartControl(data, function(err){
        if (err) {
          socket.emit('serverSendFail', err);
        } else {
          socket.emit('serverSendAddCartSuc');
        }
        delete isBusy[userId];
      });
    }
  });
  socket.on('clientGetListCartToPay', function() {
    if (socket.handshake.session.loggedin){
      CartController.getCartToPay(socket.handshake.session.userData.UserID, function(err, carts){
        if (err) {
          socket.emit('serverSendFail', err);
        } else {
          socket.emit('serverSendListCartToPay', carts);
        }
      });
    }
  });
});

module.exports = server;