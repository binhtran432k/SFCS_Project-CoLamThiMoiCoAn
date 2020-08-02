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
}