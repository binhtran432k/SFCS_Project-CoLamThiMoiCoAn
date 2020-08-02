'use strict';
const Config = require('./config');

module.exports = class UserDB {
    static getUserByLoginName(loginName, callback){
        let db = Config.getConnection();
        db.get(`
            SELECT * FROM Users
            WHERE LoginName = $loginName
        `, { $loginName: loginName }, callback);
        //db.close();
    }
    static addUser(userName, email, loginName, hash, userType, valid, callback) {
        let db = Config.getConnection();
        db.run(`
            INSERT INTO Users(Email, LoginName, Hash, UserName, UserType, CreatedDate, Valid)
            VALUES($email, $loginName, $hash, $userName, $userType, $createdDate, $valid);
            `, {
                $email: email,
                $loginName: loginName,
                $hash: hash,
                $userName: userName,
                $userType: userType,
                $createdDate: Date.now(),
                $valid: valid
            }, callback);
    }
    static addManager(callback) {
        let db = Config.getConnection();
        db.run(`
            UPDATE Users
            SET UserType = 3
            WHERE UserID = 1;
            `, [], callback);
    }
}