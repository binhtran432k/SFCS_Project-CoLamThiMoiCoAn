const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./sfcs.db');

db.serialize(() => {
    db.run(`
        INSERT INTO Users(Email, LoginName, Hash, UserName, UserType, CreatedDate, valid)
        VALUES($email, 'binbinbin', '123456789', 'binbin', 0, 123456, 1);
        `, {
            $email: 'aasd@gmail.com'
        }, (err) => {
            console.log(err);
        });
});