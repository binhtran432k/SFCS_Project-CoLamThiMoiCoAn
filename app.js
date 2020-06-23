"use strict"
// Import all dependencies & middleware here
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const UserController = require('./controllers/user.controller');
const errorHandler = require('./helpers/error-handler');
//const db = require('./database/config/config.firebase');

// Init an Express App.
const app = express();

// External system
const FakeEmail = require('./external-system/fake-email/fake.email');
app.use('/external', FakeEmail);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');app.set()

// Use your dependencies here
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// use all controllers(APIs) here
//app.get('/', UserController);
//app.post('/add-user', UserController);
//app.get('/login', UserController);
//app.post('/auth', UserController);
//app.get('/logout', UserController);
//app.get('/signup', UserController);
//app.post('/makeacc', UserController);
//app.post('/delacc', UserController);
app.use('/', UserController);

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, () => {
  console.log('Server is running on port ' + port);
  console.log('link: http://localhost:' + port);
  //db.ref("connectedTest").once("value").then(function(snapshot){
  //  let isConnected = snapshot.val();
  //  if (isConnected == true)
  //    console.log("Connected to firebase");
  //});
});
