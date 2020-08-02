'use strict'
const FoodDB = require('../data-access/food.db');
const ErrorHandling = require('./error.handling');

module.exports = class FoodManagementController {
    static getListAllFoods(callback){
        FoodDB.getListAllFoods(function(err, foods){
            if (err) {
                console.log(err);
                return callback(0, 'serverSendMessage', 1, null);
            }
            else {
                return callback(0, 'serverSendListAllFoods', 0, foods);
            }
        });
    }
}