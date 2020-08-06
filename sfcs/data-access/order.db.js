'use strict'
const Config = require('./config');

module.exports = class OrderDB {
    static addOrder(callback){
        let db = Config.getConnection();
        db.run(`
        INSERT INTO Orders (CreatedDate)
        VALUES ($createdDate);
        `, {
            $createdDate: Date.now()
        }, callback);
    }
    static getOrderListByOwnerId(ownerId, cartState, foodState, callback) {
        let db = Config.getConnection();
        db.all(`
        SELECT ord.OrderID, CartID, CustomerID,
        car.FoodID, NumberOfCart, FoodName,
        FoodPrice, ImageName, UserName as CustomerName
        FROM Orders as ord
        INNER JOIN Carts as car
        ON ord.OrderID = car.OrderID
        INNER JOIN Foods as foo
        ON car.FoodID = foo.FoodID
        INNER JOIN Users as use
        ON car.CustomerID = use.UserID
        WHERE car.CartState = $cartState
        AND foo.OwnerID = $ownerId
        AND foo.FoodState = $foodState
        ORDER BY ord.OrderID, CartID
        `, {
            $cartState: cartState,
            $ownerId: ownerId,
            $foodState: foodState
        }, callback);
    }
}