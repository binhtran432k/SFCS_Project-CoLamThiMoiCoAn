'use strict'
function checkEmail(inputText) {
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (inputText.match(mailformat)) {
		return true;
	} else {
		return false;
	}
}
function checkAccount(inputtxt) { 
    var passw=  /^\w{8,20}$/;
    if (inputtxt.match(passw)) { 
        return true;
    } else { 
        return false;
    }
}
module.exports = class Utilities {
    static errorHandler(err, req, res, next) {
        if (typeof (err) === 'string') {
            return res.status(200).json({ message: err });
            // custom application error
        }

        // default to 500 server error
        return res.status(200).json({ message: err.message });
    }
    static needLogoutGet(req, res, next) {
	    if (req.session.loggedin) {
            res.redirect('/');
            return;
        }
        next();
    }
    static needLogout(req, res, next) {
	    if (req.session.loggedin) {
		    res.status(403).json({message: "Truy cập bị từ chối"});
		    return;
        }
        next();
    }
    static needLogin(req, res, next) {
	    if (!req.session.loggedin) {
            res.redirect('/');
            return;
        }
        next();
    }
    static validateAccount(data) {
	    if (!checkAccount(data.loginName)) {
		    return {
                message: "Tài khoản của bạn không hợp lệ",
                checkFail: true
            };
	    }
	    if (!checkAccount(data.password)) {
		    return {
                message: "Mật khẩu phải từ 8 đến 20 kí tự và chỉ chấp nhận chữ cái và số",
                checkFail: true
            };
        }
        return {checkFail: false}
    }
    static validateRegister(data) {
	    if (!data.userName) {
		    return {
                message: "Bạn chưa điền họ và tên",
                checkFail: true
            };
	    }
	    if (!checkEmail(data.email)) {
		    return {
                message: "Email của bạn không hợp lệ",
                checkFail: true
            };
	    }
	    if (data.retypePassword !== data.password) {
		    return {
                message: "Mật khẩu của bạn không đồng nhất",
                checkFail: true
            };
        }
        return {checkFail: false}
    }
}