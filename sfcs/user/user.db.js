'use strict'
const Config = require('../config');
const User = require('./user');

//const Stall = require('./stall');

module.exports = class UserDB {
    static getUserByLoginName(loginName, callback){
        let db = Config.getConnection();
        db.get(`
            SELECT * FROM Users
            WHERE LoginName = $loginName
        `, { $loginName: loginName },
        function(err, row){
            if (err) callback({
                errorFail: true,
                message: err.message
            });
            if (row) callback(row);
            else callback();
        });
        db.close();
    }
}