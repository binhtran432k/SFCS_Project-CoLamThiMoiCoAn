'use strict'
const OrderDB = require('../data-access/order.db');
// Private field

module.exports = class OrderManagementController {
    static makeOrder(callback) {
        OrderDB.addOrder(function(err){
            if (err) {
                console.log(err);
                return callback(0, 'serverSendMessage', 1, null);
            }
            else {
                return callback(6, null, 0, this.lastID);
            }
        });
    }
    static getListAllOrderToProccess(ownerId, callback) {
        OrderDB.getOrderListByOwnerId(ownerId, 2, 1, function(err, orders) {
            if (err) {
                console.log(err);
                return callback(0, 'serverSendMessage', 1, null);
            }
            return callback(0, 'serverSendListAllOrderToProccess', 0, orders);
        });
    }
}