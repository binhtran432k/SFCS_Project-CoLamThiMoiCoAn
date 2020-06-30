'use strict'
const sqlite3 = require('sqlite3').verbose();

module.exports = class Config {
    static getConnection() {
        return new sqlite3.Database(__dirname + '/sfcs.db');
    }
}