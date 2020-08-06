'use strict';
const Config = require('./config');

module.exports = class UserDB {
    static getUserByLoginName(loginName, callback){
        let db = Config.getConnection();
        db.get(`
            SELECT u.UserID, u.Email, u.LoginName,
            u.Hash, u.UserName, u.UserType, u.CreatedDate,
            s.OwnerID, s.StallName, s.StallDescription,
            o.UserName as OwnerName
            FROM Users as u
            LEFT JOIN Cooks as c
            ON u.UserID = c.CookID
            LEFT JOIN Stalls as s
            ON c.OwnerID = s.OwnerID
            OR u.UserID = s.OwnerID
            LEFT JOIN Users as o
            ON s.OwnerID = o.UserID
            WHERE ((o.Valid IS NULL AND u.Valid = 1)
            OR (o.Valid = 1)) AND u.LoginName = $loginName
        `, { $loginName: loginName }, callback);
        //db.close();
    }
    static addUser(userName, email, loginName, hash, userType, valid, callback) {
        let db = Config.getConnection();
        db.run(`
            INSERT INTO Users(Email, LoginName, Hash,
            UserName, UserType, CreatedDate, Valid)
            SELECT $email, $loginName, $hash,
            $userName,
            CASE
                WHEN EXISTS
                (SELECT 1 FROM Users
                WHERE UserID = 1)
                THEN $userType
                ELSE 3
            END as UserType, $createdDate, $valid
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
}