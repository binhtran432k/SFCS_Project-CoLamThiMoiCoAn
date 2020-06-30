'use strict'
module.exports = class CustomerView {
   static viewRegister(req, res) {
	   	const userData = req.session.userData || {};
		res.render('user.view/register', {
			title: 'Đăng ký tài khoản',
		    loggedin: req.session.loggedin,
		    userName: userData.UserName,
		    userType: userData.UserType
	    });
    }
}