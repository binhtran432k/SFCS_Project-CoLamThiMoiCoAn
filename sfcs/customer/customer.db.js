'use strict'
const sqlite3 = require('sqlite3').verbose();
const Config = require('../config');
const User = require('./customer');

module.exports = class CustomerDB {
    static createCustomer(data, callback) {
        let db = Config.getConnection();
        db.run(`
            INSERT INTO Users(Email, LoginName, Hash, UserName, UserType, CreatedDate, Valid)
            VALUES($email, $loginName, $hash, $userName, $userType, $createdDate, $valid);
            `, {
                $email: data.email,
                $loginName: data.loginName,
                $hash: data.hash,
                $userName: data.userName,
                $userType: 0,
                $createdDate: Date.now(),
                $valid: 1
            }, function(err) {
                if (err && err.errno === 19) {
                    callback({
                        message: 'Tài khoản này đã có người sử dụng'
                    });
                } else if (this.lastID === 1) {
                    db.run(`
                        UPDATE Users
                        SET UserType = 3
                        WHERE UserID = 1;
                        `, [], function (err) {
                            if (err) callback({
                                errorFail: true,
                                message: err.message
                            });
                            else callback();
                        });
                } else if (err) callback({
                    errorFail: true,
                    message: err.message
                });
                else callback();
                db.close();
            });
    }
}