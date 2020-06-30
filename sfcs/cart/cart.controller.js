'use strict'
const CartDB = require('./cart.db');
const CartView = require('./cart.view');

module.exports = class CartController {
    static getNumCartToPayByUserId(userId, callback) {
        CartDB.getNumCartToPayByUserId(userId, function(err, numCartToPay){
            callback(err, numCartToPay);
        });
    }
    static addToCartControl(data, callback){
        CartDB.addToCart(data, function(err){
            callback();
        });
    }
    static controlCart(req, res, next){
        CartView.viewCart(req, res);
    }
    static getCartToPay(userId, callback){
        CartDB.getCartToPayByUserId(userId, function(err, carts){
            callback(err, carts)
        })
    }
}