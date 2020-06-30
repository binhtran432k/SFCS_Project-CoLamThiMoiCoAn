'use strict'
module.exports = class UserView {
   static viewHomepage(req, res) {
	   	const userData = req.session.userData || {};
	    res.render('user.view/index', {
		    title: 'Trang chủ',
		    loggedin: req.session.loggedin,
		    userName: userData.UserName,
		    userType: userData.UserType
	    });
    }
   static viewLogin(req, res) {
	   	const userData = req.session.userData || {};
		res.render('user.view/login', {
			title: 'Đăng nhập',
		    loggedin: req.session.loggedin,
		    userName: userData.UserName,
		    userType: userData.UserType
	    });
    }
   static viewAbout(req, res) {
	   	const userData = req.session.userData || {};
		res.render('user.view/about', {
			title: 'Về chúng tôi',
		    loggedin: req.session.loggedin,
		    userName: userData.UserName,
		    userType: userData.UserType
	    });
    }
}