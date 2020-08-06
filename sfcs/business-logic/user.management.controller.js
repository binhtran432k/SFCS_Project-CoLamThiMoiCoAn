'use strict'
const sha256 = require('sha256');

const UserDB = require('../data-access/user.db');
const ValidationChecking = require('./validation.checking');

module.exports = class UserManagementController {
    static authenticate(loginName, password, callback) {
        var checkData = ValidationChecking.checkAuthenticate(loginName,
            password);
        if (checkData != 0) {
            return callback(0, 'serverSendMessage', checkData, null);
        }
        UserDB.getUserByLoginName(loginName, function (err, user) {
            if (err) {
                console.log(err);
                return callback(0, 'serverSendMessage', 1, null);
            }
            if (user && sha256(password) === user.Hash) {
                return callback(2, null, 0, user);
            }
            return callback(0, 'serverSendMessage', 2, null);
        });
    }
    static register(userName, email, loginName, password, retypePassword, callback) {
        var checkData = ValidationChecking.checkRegister(
            userName, email, retypePassword, password
        );
        if (checkData != 0) {
            return callback(0, 'serverSendMessage',
                checkData, null);
        }
        var checkData2 = ValidationChecking.checkAuthenticate(
            loginName, password
        );
        if (checkData2 != 0) {
            return callback(0, 'serverSendMessage',
                checkData2, null);
        }
        UserDB.addUser(userName, email, loginName, sha256(password), 0, 1, function (err) {
            if (err && err.errno === 19) {
                console.log(err);
                var messageErr = err.errno === 19? 10: 1;
                return callback(0, 'serverSendMessage', messageErr, null);
            }
            else {
                return callback(1, 'serverSendRedirectHome', 0, null);
            }
        });
    }
}