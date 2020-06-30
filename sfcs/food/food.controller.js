'use strict'
const FoodDB = require('./food.db');

module.exports = class FoodController {
    static getListFood(callback){
        FoodDB.getListAllFood(function(err, foods){
            callback(err, foods);
        });
    }
}