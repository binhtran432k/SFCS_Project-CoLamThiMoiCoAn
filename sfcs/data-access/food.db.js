'use strict'
const Config = require('./config');

module.exports = class FoodDB {
    static getListAllFoods(callback){
        let db = Config.getConnection();
        db.all(`
        SELECT FoodID, FoodName, StallName, FoodPrice, ImageName
        FROM Foods
        INNER JOIN Stalls
        ON Foods.OwnerID = Stalls.OwnerID
        INNER JOIN Users
        ON Stalls.OwnerID = Users.UserID
        WHERE Valid = 1 AND FoodState = 1;
        `, [], callback);
        //db.close();
    }
}