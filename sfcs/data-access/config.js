'use strict'
const sqlite3 = require('sqlite3').verbose();
// Private field
let connection = null;
function constructor() {
    return new sqlite3.Database(__dirname + '/sfcs.db');
}

module.exports = class Config {
    static getConnection() {
        if (!connection) {
            console.log('connected to database');
            connection = constructor();
        }
        return connection;
    }
}