const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./sfcs.db');
/*db.run(`INSERT INTO Users (Email, LoginName, Hash, Username, UserType, CreatedDate, Valid)
VALUES ('manager@gmail.com', 'manager0123', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'Ma Na Ger', 0, 1593097162649, 1)`, [],
    function(err){
        if (err && err.errno === 19) {
            db.get(`
                SELECT UserID
                FROM Users
                WHERE Email = 'manager@gmail.com'
                `, [],
                function (err, row) {
                    if (err) console.log(err.message);
                    else if (row) console.log('Email taken');
                    else console.log('Username taken');
                });
        }
        if (err) console.log(err.message);
        else if (this.lastID === 1) {
            db.run(`UPDATE Users
            SET UserType = 3
            WHERE UserID = 1;`, [], function(err){
                if (err) console.log(err);
            });
        }
    });*/
/*db.run(`INSERT INTO Users (Email, LoginName, Hash, Username, UserType, CreatedDate, Valid)
VALUES ('customer@gmail.com', 'customer0123', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'Cus To Mer', 0, 1593097162659, 1)`, [],
    function(err){
        if (err && err.errno === 19) {
            db.get(`
                SELECT UserID
                FROM Users
                WHERE Email = 'manager@gmail.com'
                `, [],
                function (err, row) {
                    if (err) console.log(err.message);
                    else if (row) console.log('Email taken');
                    else console.log('Username taken');
                });
        }
        if (err) console.log(err.message);
        else if (this.lastID === 1) {
            db.run(`UPDATE Users
            SET UserType = 3
            WHERE UserID = 1;`, [], function(err){
                if (err) console.log(err);
            });
        }
    });*/
db.run(`INSERT INTO Users (Email, Hash, Username, UserType, CreatedDate, Valid)
VALUES ('owner@gmail.com', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'Owner', 0, 1593097162669, 3)`, [],
    function(err){
        if (err && err.errno === 19) {
            db.get(`
                SELECT UserID
                FROM Users
                WHERE Email = 'manager@gmail.com'
                `, [],
                function (err, row) {
                    if (err) console.log(err.message);
                    else if (row) console.log('Email taken');
                    else console.log('Username taken');
                });
        }
        if (err) console.log(err.message);
        else if (this.lastID === 1) {
            db.run(`UPDATE Users
            SET UserType = 3
            WHERE UserID = 1;`, [], function(err){
                if (err) console.log(err);
            });
        }
    });
db.close();
