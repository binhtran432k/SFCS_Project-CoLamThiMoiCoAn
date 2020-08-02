'use strict'
const Config = require('./config');

module.exports = class CartDB {
    static getNumCartToPayByUserId(userId, callback){
        let db = Config.getConnection();
        db.get(`
        SELECT sum(NumberOfCart) as numCartToPay
        FROM Carts
        WHERE CustomerID = $customerId AND CartState BETWEEN 0 AND 1;
        `, {$customerId: userId}, callback);
        //db.close();
    }
    static getCartToAdd(foodId, userId, callback) {
        let db = Config.getConnection();
        db.get(`
        SELECT CartID, NumberOfCart
        FROM Carts
        WHERE FoodID = $foodId AND CustomerID = $customerId AND CartState = 1;
        `, {
            $foodId: foodId,
            $customerId: userId
        }, callback);
    }
    static addToCart(foodId, userId, callback){
        let db = Config.getConnection();
        db.run(`
        INSERT INTO Carts (FoodID, CustomerID)
        VALUES ($foodId, $customerId);
        `, {
            $foodId: foodId,
            $customerId: userId
        }, callback);
        //db.close();
    }
    static removeCartByCartId(cartId, callback){
        let db = Config.getConnection();
        db.run(`
        DELETE FROM Carts
        WHERE CartID = $cartId;
        `, {
            $cartId: cartId
        }, callback);
    }
    static increaseCartByCartId(cartId, callback){
        let db = Config.getConnection();
        db.run(`
        UPDATE Carts
        SET NumberOfCart = NumberOfCart + 1
        WHERE CartID = $cartId;
        `, {
            $cartId: cartId
        }, callback);
    }
    static changeCartByCartId(cartId, numToChange, callback){
        let db = Config.getConnection();
        db.run(`
        UPDATE Carts
        SET NumberOfCart = $numToChange
        WHERE CartID = $cartId;
        `, {
            $numToChange: numToChange,
            $cartId: cartId
        }, callback);
    }
    static makeCartBePayment(userId, orderId, callback){
        let db = Config.getConnection();
        db.run(`
        UPDATE Carts
        SET OrderID = $orderId, cartState = 2
        WHERE CustomerID = $userId AND CartState = 1;
        `, {
            $orderId: orderId,
            $userId: userId
        }, callback);
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
        WHERE Valid = 1 AND (CartState BETWEEN 0 AND 1) AND CustomerID = $customerId
        ORDER BY StallName;
        `, {$customerId: userId}, callback);
        //db.close();
    }
}