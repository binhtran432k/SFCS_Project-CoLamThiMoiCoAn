'use strict'
const Config = require('../config');

module.exports = class CartDB {
    static getNumCartToPayByUserId(userId, callback){
        let db = Config.getConnection();
        db.get(`
        SELECT sum(NumberOfCart) as numCartToPay
        FROM Carts
        WHERE CustomerID = $customerId AND CartState BETWEEN 0 AND 1;
        `, {$customerId: userId},
        function(err, row){
            if (err) callback({
                errorFail: true,
                message: err.message
            }, null);
            else callback(null, row.numCartToPay);
        });
        db.close();
    }
    static addToCart(data, callback){
        let db = Config.getConnection();
        db.run(`
        INSERT INTO Carts (FoodID, CustomerID)
        VALUES ($foodId, $customerId);
        `, {
            $foodId: data.foodId,
            $customerId: data.customerId
        }, function(err){
            if (err) callback({
                errorFail: true,
                message: err.message
            });
            else callback();
        });
        db.close();
    }
    static getCartToPayByUserId(userId, callback){
        let db = Config.getConnection();
        db.all(`
        SELECT CartID, CartState, NumberOfCart, Carts.FoodID, FoodState, FoodName, StallName, FoodPrice, ImageName
        FROM Carts
        INNER JOIN Foods
        ON Foods.FoodID = Carts.FoodID
        INNER JOIN Stalls
        ON Foods.OwnerID = Stalls.OwnerID
        INNER JOIN Users
        ON Stalls.OwnerID = Users.UserID
        WHERE Valid = 1 AND (CartState BETWEEN 0 AND 1) AND CustomerID = $customerId;
        `, {$customerId: userId},
        function(err, rows){
            if (err) callback({
                errorFail: true,
                message: err.message
            }, null);
            else callback(null, rows);
        });
        db.close();
    }
}