'use strict'
const CartDB = require('../data-access/cart.db');
// Private field

module.exports = class CartManagementController {
    static getNumCartToPayByUserId(userId, callback) {
        CartDB.getNumCartToPayByUserId(userId, function(err, cartData){
            if (err) {
                console.log(err);
                return callback(0, 'serverSendMessage', 1, null);
            }
            else {
                return callback(4, 'serverSendNumCartToPay',
                0, cartData.numCartToPay);
            }
        });
    }
    static addToCart(foodId, userId, callback){
        function addToCartSuccess(err) {
            if (err) {
                console.log(err);
                return callback(0, 'serverSendMessage', 1);
            }
            else {
                return callback(4, 'serverChangeCart', 0);
            }
        }
        CartDB.getCartToAdd(foodId, userId, function(err, cartData){
            if (err) {
                console.log(err);
                return callback(0, 'serverSendMessage', 1);
            }
            else {
                if (cartData) {
                    CartDB.increaseCartByCartId(cartData.CartID, addToCartSuccess)
                }
                else {
                    CartDB.addToCart(foodId, userId, addToCartSuccess);
                }
            }
        });
        return;
    }
    static getCartToPay(userId, callback){
        CartDB.getCartToPayByUserId(userId, function(err, carts){
            if (err) {
                console.log(err);
                return callback(0, 'serverSendMessage', 1, null);
            }
            else {
                return callback(0, 'serverSendListCartToPay', 0, carts);
            }
        });
    }
    static removeCart(cartId, callback) {
        CartDB.removeCartByCartId(cartId, function(err){
            if (err) {
                console.log(err);
                return callback(0, 'serverSendMessage', 1);
            }
            else {
                return callback(4, 'serverChangeCart', 0);
            }
        });
    }
    static changeCart(cartId, numToChange, callback) {
        if (isNaN(numToChange)) {
            return callback(0, 'serverSendMessage', 11);
        }
        else if (numToChange > 99 || numToChange < 1) {
            return callback(0, 'serverSendMessage', 12);
        }
        CartDB.changeCartByCartId(cartId, numToChange, function(err){
            if (err) {
                console.log(err);
                return callback(0, 'serverSendMessage', 1);
            }
            else {
                return callback(4, 'serverChangeCart', 0);
            }
        });
    }
    static makeCartBePayment(userId, orderId, callback) {
        CartDB.makeCartBePayment(userId, orderId, function(err){
            if (err) {
                console.log(err);
                return callback(0, 'serverSendMessage', 1, null);
            }
            else {
                CartDB.getOwnerIdByOrderId(orderId, function(err, distinctCart) {
                    if (err) {
                        console.log(err);
                        return callback(0, 'serverSendMessage', 1, null);
                    }
                    else {
                        callback(4, 'serverChangeCart', 0, null);
                        distinctCart.forEach(function(e){
                            callback(7, 'serverSendOrderMade', 0, e.OwnerID);
                        });
                        return;
                    }
                });
            }
        });
    }
}