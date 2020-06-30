'use strict'
const Config = require('../config');

module.exports = class FoodDB {
    static getListAllFood(callback){
        let db = Config.getConnection();
        db.all(`
        SELECT FoodID, FoodName, StallName, FoodPrice, ImageName
        FROM Foods
        INNER JOIN Stalls
        ON Foods.OwnerID = Stalls.OwnerID
        INNER JOIN Users
        ON Stalls.OwnerID = Users.UserID
        WHERE Valid = 1 AND FoodState = 1;
        `, [], function(err, rows){
            if (err) callback({
                errorFail: true,
                message: err.message
            }, null);
            else callback(null, rows);
        });
        db.close();
    }
}