const express = require('express');
const User = require('../database/models/user');
const UserDB = require('../database/models/user.db');
const UserView = require('../views/user.view');
const sha256 = require('sha256');

const UserController = express.Router();

UserController.use('/', UserView);

// routes
UserController.post('/user/authenticate', authenticate);
UserController.get('/user/logout', logout);
UserController.post('/customer/register', registerCustomer);
UserController.post('/customer/delete', deleteCustomer);
UserController.post('/owner/register', registerOwner);
//UserController.post('/owner/add-cook', addPreCook);
UserController.post('/manager/get-stalls', getAllStall);
UserController.post('/manager/add-owner', addPreOwner);
UserController.post('/manager/cancel-owner', cancelPreOwner);
UserController.post('/manager/accept-owner', acceptOwner);
UserController.post('/manager/disable-owner', disableOwner);
UserController.post('/manager/delete-owner', deleteOwner);

module.exports = UserController;

function ValidateEmail(inputText)
{
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (inputText.match(mailformat)) {
		return true;
	} else {
		return false;
	}
}
function checkPassword(inputtxt) { 
    var passw=  /^\w{8,20}$/;
    if (inputtxt.match(passw)) { 
        return true;
    } else { 
        return false;
    }
}

function authenticate(req, res, next) {
	if (req.session.loggedin) {
		res.status(403).json({message: "Truy cập bị từ chối"});
		return;
	}
	if (!ValidateEmail(req.body.email)) {
		res.status(200).json({message: "Email của bạn không hợp lệ"});
		return;
	}
	if (!checkPassword(req.body.password)) {
		res.status(200).json({message: "Mật khẩu phải từ 8 đến 20 kí tự và chỉ chấp nhận chữ cái và số"});
		return;
	}
    UserDB.authenticate(req.body)
        .then(user => {
			if (user) {
				req.session.loggedin = true;
				req.session.uid = user.id;
				req.session.email = user.email;
				req.session.name = user.name;
				req.session.hash = user.hash;
				req.session.userType = user.userType;
				req.session.createdDay = user.createdDay;
				res.json(user);
			} else {
				res.status(200).json({
					message: 'Tài khoản hoặc mật khẩu không đúng'
				});
			}
		})
		.catch(err => next(err));
}

function registerCustomer(req, res, next) {
	if (req.session.loggedin) {
		res.status(403).json({message: "Truy cập bị từ chối"});
		return;
	}
	if (!req.body.name.first || !req.body.name.last) {
		res.status(200).json({message: "Bạn chưa điền họ và tên đầy đủ"});
		return;
	}
	if (!ValidateEmail(req.body.email)) {
		res.status(200).json({message: "Email của bạn không hợp lệ"});
		return;
	}
	if (req.body.retypePassword !== req.body.password) {
		res.json({message: "Mật khẩu của bạn không đồng nhất"});
		return;
	}
	if (!checkPassword(req.body.password)) {
		res.status(200).json({message: "Mật khẩu phải từ 8 đến 20 kí tự và chỉ chấp nhận chữ cái và số"});
		return;
	}
	let userParam = req.body;
	userParam.hash = sha256(userParam.password);
	userParam.createdDay = Date.now();
	userParam.userType = 0;
	userParam.valid = 1;
	UserDB.createCustomer(userParam)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function logout(req, res, next) {
	if (!req.session.loggedin) {
		res.status(403).json({message: "Truy cập bị từ chối"});
		return;
	}
	req.session.destroy(err => {
		next(err);
		return;
	});
	res.redirect('/');
}

function deleteCustomer(req, res, next) {
	if (!req.session.loggedin || req.session.userType != 0) {
		res.status(403).json({message: "Truy cập bị từ chối"});
		return;
	}
	if (sha256(req.body.password) != req.session.hash){
		res.status(200).json({message: "Mật khẩu không đúng"});
		return;
	}
	let userParam = {
		id: req.session.uid,
		username: req.session.username,
		hash: req.session.hash,
		userType: req.session.userType
	};
	UserDB.removeCustomer(userParam)
		.then(() => {
			req.session.destroy(err => {
				next(err);
				return;
			});
			res.json({});
		})
		.catch(err => next(err));
}

function addPreOwner(req, res, next) {
	if (!req.session.loggedin || req.session.userType != 3) {
		res.status(403).json({message: "Truy cập bị từ chối"});
		return;
	}
	let userParam = {
		id: req.session.uid,
		username: req.session.username,
		hash: req.session.hash,
		userType: req.session.userType
	};
	let desParam = req.body;
	desParam.preHash = sha256(Date.now().toString());
	desParam.createdDay = Date.now();
	desParam.userType = 2;
	desParam.valid = 3;
	UserDB.createPreOwner(userParam, desParam)
		.then((key) => res.json({ id: key.id, key: key.key}))
		.catch(err => next(err));
}
function getAllStall(req, res, next) {
	if (!req.session.loggedin || req.session.userType != 3) {
		res.status(403).json({message: "Truy cập bị từ chối"});
		return;
	}
	UserDB.getAllStall()
		.then((stalls) => res.json(stalls))
		.catch(err => next(err));
}
function cancelPreOwner(req, res, next) {
	if (!req.session.loggedin || req.session.userType != 3) {
		res.status(403).json({message: "Truy cập bị từ chối"});
		return;
	}
	let userParam = {
		id: req.session.uid,
		username: req.session.username,
		hash: req.session.hash,
		userType: req.session.userType
	};
	let desParam = {
		idStall: req.body.idStall,
		nameOfStall: req.body.nameOfStall,
		nameOfOwner: req.body.nameOfOwner,
		email: req.body.email,
		owner: req.body.owner,
	};
	UserDB.removePreOwner(userParam, desParam)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function registerOwner(req, res, next) {
	if (req.session.loggedin) {
		res.status(403).json({message: "Truy cập bị từ chối"});
		return;
	}
	let userParam = req.body;
	userParam.idStall = req.body.id;
	userParam.preHash = req.body.key;
	userParam.hash = sha256(userParam.password);
	userParam.valid = 2;
	userParam.createdDay = Date.now();
	UserDB.createOwner(userParam)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function acceptOwner(req, res, next) {
	if (!req.session.loggedin || req.session.userType != 3) {
		res.status(403).json({message: "Truy cập bị từ chối"});
		return;
	}
	let userParam = {
		id: req.session.uid,
		username: req.session.username,
		hash: req.session.hash,
		userType: req.session.userType
	};
	let desParam = {
		idStall: req.body.idStall,
		nameOfStall: req.body.nameOfStall,
		nameOfOwner: req.body.nameOfOwner,
		email: req.body.email,
		owner: req.body.owner,
	};
	UserDB.acceptOwner(userParam, desParam)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function disableOwner(req, res, next) {
	if (!req.session.loggedin || req.session.userType != 3) {
		res.status(403).json({message: "Truy cập bị từ chối"});
		return;
	}
	let userParam = {
		id: req.session.uid,
		username: req.session.username,
		hash: req.session.hash,
		userType: req.session.userType
	};
	let desParam = {
		idStall: req.body.idStall,
		nameOfStall: req.body.nameOfStall,
		nameOfOwner: req.body.nameOfOwner,
		email: req.body.email,
		owner: req.body.owner,
	};
	UserDB.disableOwner(userParam, desParam)
		.then(() => res.json({}))
		.catch(err => next(err));
}
function deleteOwner(req, res, next) {
	if (!req.session.loggedin || req.session.userType != 3) {
		res.status(403).json({message: "Truy cập bị từ chối"});
		return;
	}
	let userParam = {
		id: req.session.uid,
		username: req.session.username,
		hash: req.session.hash,
		userType: req.session.userType
	};
	let desParam = {
		idStall: req.body.idStall,
		nameOfStall: req.body.nameOfStall,
		nameOfOwner: req.body.nameOfOwner,
		email: req.body.email,
		owner: req.body.owner,
	};
	UserDB.deleteOwner(userParam, desParam)
		.then(() => res.json({}))
		.catch(err => next(err));
}

///**
 //* GET /
 //* Show homepage of the system
 //*/
//UserController.get('/', (req, res) => {
	//res.render('user/index', {
		//title: 'Trang chủ',
		//loggedin: req.session.loggedin,
		//username: req.session.username
	//});
//});

///**
 //* GET /login
 //* To get login to system
 //*/
//UserController.get('/login', (req, res) => {
	//if (req.session.loggedin) {
		//res.redirect('/');
	//} else {
		//res.render('user/login', {
			//title: 'Đăng nhập',
			//loggedin: req.session.loggedin,
			//username: req.session.username
		//});
	//}
//});

///**
 //* POST /auth
 //* Verify login session
 //* error list:
 //* 0. loggin success
 //* 1. user already loggin
 //* 2. user not exist or invalid
 //* 3. wrong password
 //* 4. not enough infomation
 //*/
//UserController.post('/auth', (req, res) => {
	//if (req.session.loggedin) {
		//res.json({error: 1});
	//} else {
		//const { username, password } = req.body;
		//if (username && password) {
			//UserDB.getUser(username, (user, exist) => {
				//let valid = user.getValid();
				//if (!exist || valid == 0) {
					//res.json({error: 2});
				//} else {
					//let successSignin = user.comparePassword(password);
					//if (successSignin === true) {
						//req.session.loggedin = true;
						//req.session.username = username;
						//req.session.hashedPassword = user.getHashedPassword();
						//req.session.userType = user.getUserType();
						//res.json({error: 0});
					//} else {
						//res.json({error: 3});
					//}
				//}
			//});
		//} else {
			//res.json({error: 4});
		//}
	//}
//});

///**
 //* GET /logout
 //* To logout of the system
 //*/
//UserController.get('/logout', (req, res) => {
	//req.session.destroy();
	//res.redirect('/');
//});

///**
 //* GET /signup
 //* Create a accounts in systems
 //*/
//UserController.get('/signup', (req, res) => {
	//if (req.session.loggedin) {
		//res.redirect('/');
	//} else {
		//res.render('user/signup', {
			//title: 'Đăng ký tài khoản',
			//loggedin: req.session.loggedin,
			//username: req.session.username
		//});
	//}
//});

///**
 //* POST /makeacc
 //* Create account and save to database
 //* error list:
 //* 0. signup success
 //* 1. account exist
 //* 2. user already login
 //* 3. password not consistent
 //* 4. not enough infomation
 //*/
//UserController.post('/makeacc', (req, res) => {
	//let speUserType;
	//if (req.session.loggedin && req.session.userType == 3) {
		//speUserType = 2;
	//} else if (req.session.loggedin && req.session.userType == 2) {
		//speUserType = 1;
	//} else if (req.session.loggedin) {
		//res.json({error: 2});
		//return;
	//} else {
		//speUserType = 0;
	//}
	//const { username, password, retypePassword } = req.body;
	//if (username && password && retypePassword) {
		//if (password != retypePassword) {
			//res.json({error: 3})
		//} else {
			//const hashedPassword = sha256(password);
			//UserDB.addUser(username, hashedPassword, speUserType, (error) => {
				//res.json({error: error});
			//});
		//}
	//} else {
		//res.json({error: 4});
	//}
//});

///**
 //* POST /delacc
 //* Delete account from database
 //* error list:
 //* 0. successed
 //* 1. account not exist
 //* 2. cannot remove manager
 //* 3. failed
 //* 4. cook cannot remove itself
 //* 5. not enough infomation
 //* 6. user not already login
 //*/
//UserController.post('/delacc', (req, res) => {
	//const { username, password } = req.body;
	//if (req.session.loggedin) {
		//if (req.session.userType == 1) {
			//res.json({error: 4});
		//} else if (username && (password || req.session.userType > 1)) {
			//UserDB.verifySession(
				//req.session.username,
				//req.session.hashedPassword,
				//req.session.userType,
				//(success) => {
					//UserDB.removeUser(username, req.session.userType, (error) => {
						//res.json({error: error});
					//});
				//}
			//)
		//} else {
			//res.json({error: 5});
		//}
	//} else {
		//res.json({error: 6});
	//}
//});

