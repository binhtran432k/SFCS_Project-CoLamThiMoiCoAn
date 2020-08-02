'use strict'
// Import all dependencies & middleware here
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const bodyParser = require('body-parser');

const UserManagementController =
  require('./business-logic/user.management.controller');
const FoodManagementController =
  require('./business-logic/food.management.controller');
const CartManagementController =
  require('./business-logic/cart.management.controller');
const OrderManagementController =
  require('./business-logic/order.management.controller');
const ActionHandling = require('./business-logic/action.handling');
const BusyHandling = require('./business-logic/busy.handling');

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// use all controllers(APIs) here
function renderPage(req, res, page, title,
  checkLogin, checkLogout) {
  const userData = req.session.userData || {};
  if ((checkLogin && req.session.loggedin)
    || (checkLogout && !req.session.loggedin)) {
    return res.redirect('/');
  }
  res.render('index', {
    page: page,
    option: req.query.option,
    title: title,
    userData: userData,
    loggedin: req.session.loggedin,
    userName: userData.UserName,
    userType: userData.UserType
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
  if (socket.handshake.session.id)
    socket.join('SessionID'
      + socket.handshake.session.id);
  if (socket.handshake.session.loggedin) {
    socket.join('UserID'
      + socket.handshake.session.userData.UserID);
  }
  socket.on('clientLogout', function () {
    ActionHandling.doAction(3, null, {}, io, socket);
  });
  socket.on('clientLogin', function (data) {
    if (!socket.handshake.session.loggedin) {
      UserManagementController.authenticate(data.loginName, data.password,
        function (actionNo, messageEmit, errorNo, user) {
          ActionHandling.doAction(actionNo, messageEmit, { errorNo: errorNo, user: user },
            io, socket);
        });
    }
  });
  socket.on('clientRegister', function (data) {
    if (!socket.handshake.session.loggedin) {
      let sessionId = socket.handshake.session.id;
      if (BusyHandling.checkSessionBusy(sessionId)) {
        return ActionHandling.doAction(0, 'serverSendMessage', { errorNo: 5 },
          io, socket);
      }
      BusyHandling.addSessionBusy(sessionId);
      UserManagementController.register(data.userName, data.email,
        data.loginName, data.password, data.retypePassword,
        function (actionNo, messageEmit, errorNo) {
          ActionHandling.doAction(actionNo, messageEmit, { errorNo: errorNo },
            io, socket);
          BusyHandling.removeSessionBusy(sessionId);
        });
    }
  });
  socket.on('clientGetListAllFoods', function () {
    FoodManagementController.getListAllFoods(function (actionNo, messageEmit, errorNo, foods) {
      ActionHandling.doAction(actionNo, messageEmit, {
        errorNo: errorNo,
        foods: foods
      }, io, socket);
    })
  });
  socket.on('clientGetNumCartToPay', function () {
    if (socket.handshake.session.loggedin) {
      let userData = socket.handshake.session.userData || {};
      CartManagementController.getNumCartToPayByUserId(userData.UserID,
        function (actionNo, messageEmit, errorNo, numCartToPay) {
          ActionHandling.doAction(actionNo, messageEmit, {
            errorNo: errorNo,
            numCartToPay: numCartToPay
          }, io, socket);
        });
    }
  });
  socket.on('clientAddToCart', function (data) {
    if (socket.handshake.session.loggedin) {
      let userData = socket.handshake.session.userData || {};
      if (userData.UserType !== 0) {
        return ActionHandling.doAction(0, 'serverSendMessage', { errorNo: 13 },
          io, socket);
      }
      if (BusyHandling.checkBusy(userData.UserID)) {
        return ActionHandling.doAction(0, 'serverSendMessage', { errorNo: 5 },
          io, socket);
      }
      BusyHandling.addBusy(userData.UserID);
      CartManagementController.addToCart(parseInt(data.foodId), userData.UserID,
        function (actionNo, messageEmit, errorNo) {
          ActionHandling.doAction(actionNo, messageEmit, { errorNo: errorNo },
            io, socket);
          BusyHandling.removeBusy(userData.UserID);
        });
    } else {
      return ActionHandling.doAction(0, 'serverSendMessage', { errorNo: 9 },
        io, socket);
    }
  });
  socket.on('clientGetListCartToPay', function () {
    if (socket.handshake.session.loggedin) {
      CartManagementController.getCartToPay(
        socket.handshake.session.userData.UserID,
        function (actionNo, messageEmit, errorNo, carts) {
          ActionHandling.doAction(actionNo, messageEmit,
            { errorNo: errorNo, carts: carts }, io, socket);
        });
    }
  });
  socket.on('clientRemoveCart', function (data) {
    if (socket.handshake.session.loggedin) {
      let userData = socket.handshake.session.userData || {};
      if (BusyHandling.checkBusy(userData.UserID)) {
        return ActionHandling.doAction(0, 'serverSendMessage', { errorNo: 5 },
          io, socket);
      }
      BusyHandling.addBusy(userData.UserID);
      CartManagementController.removeCart(
        parseInt(data.cartId), function (actionNo, messageEmit, errorNo) {
          ActionHandling.doAction(actionNo, messageEmit,
            { errorNo: errorNo }, io, socket);
          BusyHandling.removeBusy(userData.UserID);
        });
    }
  });
  socket.on('clientChangeCart', function (data) {
    if (socket.handshake.session.loggedin) {
      let userData = socket.handshake.session.userData || {};
      if (BusyHandling.checkBusy(userData.UserID)) {
        return ActionHandling.doAction(0, 'serverSendMessage', { errorNo: 5 },
          io, socket);
      }
      BusyHandling.addBusy(userData.UserID);
      CartManagementController.changeCart(
        parseInt(data.cartId), data.numToChange, function (actionNo, messageEmit, errorNo) {
          ActionHandling.doAction(actionNo, messageEmit,
            { errorNo: errorNo }, io, socket);
          BusyHandling.removeBusy(userData.UserID);
        });
    }
  });
  socket.on('clientMakeOrder', function () {
    if (socket.handshake.session.loggedin) {
      let userData = socket.handshake.session.userData || {};
      if (BusyHandling.checkBusy(userData.UserID)) {
        return ActionHandling.doAction(0, 'serverSendMessage', { errorNo: 5 },
          io, socket);
      }
      BusyHandling.addBusy(userData.UserID);
      OrderManagementController.makeOrder(function (actionNo, messageEmit, errorNo, orderId) {
        ActionHandling.doAction(actionNo, messageEmit,
          { errorNo: errorNo }, io, socket);
        CartManagementController.makeCartBePayment(userData.UserID, orderId, function (actionNo, messageEmit, errorNo) {
          ActionHandling.doAction(actionNo, messageEmit,
            { errorNo: errorNo }, io, socket);
          BusyHandling.removeBusy(userData.UserID);
        });
      });
    }
  });
});

module.exports = server;