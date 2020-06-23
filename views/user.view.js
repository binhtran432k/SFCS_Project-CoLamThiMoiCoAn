const express = require('express');
const User = require('../database/models/user');
const UserDB = require('../database/models/user.db');
const sha256 = require('sha256');

const UserView = express.Router();

// routes
UserView.get('/', viewHomepage);
UserView.get('/login', viewLogin);
UserView.get('/register', viewRegister);
UserView.get('/dashboard', controlUserType);

module.exports = UserView;

function viewHomepage(req, res, next) {
	res.render('user/index', {
		title: 'Trang chủ',
		loggedin: req.session.loggedin,
		email: req.session.email
	});
}
function viewLogin(req, res, next) {
	if (req.session.loggedin) {
		res.redirect('/');
	} else {
		res.render('user/login', {
			title: 'Đăng nhập',
			loggedin: req.session.loggedin,
			email: req.session.email
		});
	}
}
function viewRegister(req, res, next) {
	if (req.session.loggedin) {
		res.redirect('/');
	} else {
		res.render('user/register', {
			title: 'Đăng ký tài khoản',
			loggedin: req.session.loggedin,
			email: req.session.email
		});
	}
}
function controlUserType(req, res, next) {
    let userTypeName;
	if (!req.session.loggedin) {
        res.redirect('/');
        return;
	} else if (req.session.userType === 0) {
        userTypeName = 'customer';
	} else if (req.session.userType === 1) {
        userTypeName = 'cook';
	} else if (req.session.userType === 2) {
        userTypeName = 'owner';
	} else if (req.session.userType === 3) {
        userTypeName = 'manager';
	}
	res.render('user/' + userTypeName, {
		title: 'Bảng điều khiển',
		loggedin: req.session.loggedin,
		id: req.session.uid,
		name: req.session.name,
		email: req.session.email,
        userType: req.session.userType,
        createdDay: req.session.createdDay,
        hash: req.session.hash
	});
}