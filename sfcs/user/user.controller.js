'use strict'
const sha256 = require('sha256');
const UserView = require('./user.view');
const UserDB = require('./user.db');
const User = require('./user');

module.exports = class UserController {
    static controlHomepage(req, res, next) {
        UserView.viewHomepage(req, res);
    }
    static controlLogin(req, res, next) {
        UserView.viewLogin(req, res);
    }
    static controlAbout(req, res, next) {
        UserView.viewAbout(req, res);
    }
    static authenticate(data, callback) {
        UserDB.getUserByLoginName(data.loginName, function(user){
            if (user && user.errorFail) {
                callback({
                    checkAuthFail: true,
                    message: user.message
                });
                return;
            }
            if (!user || sha256(data.password) !== user.Hash) {
                callback({
                    checkAuthFail: true,
                    message: 'Mật khẩu hoặc tài khoản của bạn không đúng'
                });
                return;
            }
            callback({
                ...user,
            });
        });
    }
}