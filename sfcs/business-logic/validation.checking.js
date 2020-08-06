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
module.exports = class ValidationChecking {
    static checkAuthenticate(loginName, password){
        if (!checkAccount(loginName)) {
		    return 3; // Invalid login name error
        }
        if (!checkAccount(password)) {
            return 4; // Invalid password error
        }
        return 0;
    }
    static checkRegister(userName, email, retypePassword, password) {
        if (!userName) {
            return 6;
        }
        if (!checkEmail(email)) {
            return 7;
        }
        if (retypePassword !== password) {
            return 8;
        }
        return 0;
    }
}