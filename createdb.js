const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./sfcs.db');
let sql = `
CREATE TABLE "Users" (
    "UserID"    INTEGER PRIMARY KEY AUTOINCREMENT,
        "Email" TEXT NOT NULL,
        "LoginName" TEXT UNIQUE,
        "Hash"  TEXT NOT NULL,
        "UserName"  TEXT NOT NULL,
        "UserType"  INTEGER NOT NULL,
        "CreatedDate"   INTEGER NOT NULL,
        "Valid" INTEGER NOT NULL
);

CREATE TABLE "Stalls" (
        "OwnerID"   INTEGER,
        "StallName" TEXT NOT NULL UNIQUE,
        "StallDescription"  TEXT,
        FOREIGN KEY("OwnerID") REFERENCES "Users"("UserID"),
        PRIMARY KEY("OwnerID")
);

CREATE TABLE "Cooks" (
        "CookID"    INTEGER,
        "OwnerID"   INTEGER NOT NULL,
        FOREIGN KEY("OwnerID") REFERENCES "Stalls"("OwnerID"),
        FOREIGN KEY("CookID") REFERENCES "Users"("UserID"),
        PRIMARY KEY("CookID")
);

CREATE TABLE "Foods" (
        "FoodID"    INTEGER PRIMARY KEY AUTOINCREMENT,
        "OwnerID"   INTEGER NOT NULL,
        "FoodName"  TEXT NOT NULL,
        "FoodPrice" INTEGER,
        "OriginalPrice"  INTEGER,
        "FoodState" INTEGER NOT NULL DEFAULT 0,
        "ImageName" TEXT,
        "FoodDescription"   TEXT,
        "LastUpdatedDate"   INTEGER NOT NULL,
        FOREIGN KEY("OwnerID") REFERENCES "Stalls"("OwnerID")
);

CREATE TABLE "Orders" (
        "OrderID"   INTEGER PRIMARY KEY AUTOINCREMENT,
        "OrderState"    INTEGER NOT NULL DEFAULT 0,
        "CreatedDate"   INTEGER NOT NULL
);

CREATE TABLE "Carts" (
        "CartID"    INTEGER PRIMARY KEY AUTOINCREMENT,
        "CustomerID"    INTEGER NOT NULL,
        "CookID"   INTEGER,
        "OrderID"   INTEGER,
        "FoodID"    INTEGER NOT NULL,
        "NumberOfCart"    INTEGER NOT NULL DEFAULT 1,
        "CartState" INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY("CustomerID") REFERENCES "Users"("UserID"),
        FOREIGN KEY("FoodID") REFERENCES "Foods"("FoodID"),
        FOREIGN KEY("OrderID") REFERENCES "Orders"("OrderID"),
        FOREIGN KEY("CookID") REFERENCES "Cooks"("CookID")
);

INSERT INTO Users (Email, LoginName, Hash, Username, UserType, CreatedDate, Valid)
VALUES ('manager@gmail.com', 'manager0123', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'Ma Na Ger', 0, 1593097162649, 1);

UPDATE Users
SET UserType = 3
WHERE UserID = 1;

INSERT INTO Users (Email, LoginName, Hash, Username, UserType, CreatedDate, Valid)
VALUES ('customer@gmail.com', 'customer0123', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'Cus To Mer', 0, 1593097162659, 1);

INSERT INTO Users (Email, LoginName, Hash, Username, UserType, CreatedDate, Valid)
VALUES ('owner@gmail.com', 'owner0123', '012345678', 'Ow Ner', 0, 1593097162669, 3);

INSERT INTO Stalls (OwnerID, StallName)
VALUES (3, 'Lazada');

UPDATE Users
SET Valid = 2, Hash = 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f'
WHERE UserID = 3 AND Hash = '012345678';

UPDATE Users
SET UserType = 2, Valid = 1
WHERE UserID = 3;

INSERT INTO Users (Email, LoginName, Hash, Username, UserType, CreatedDate, Valid)
VALUES ('cook@gmail.com', 'cook0123', '012345678', 'Co Ok', 0, 1593097162679, 3);

INSERT INTO Cooks (CookID, OwnerID)
VALUES (4, 3);

UPDATE Users
SET Valid = 2, Hash = 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f'
WHERE UserID = 4 AND Hash = '012345678';

UPDATE Users
SET UserType = 1, Valid = 1
WHERE UserID = 4;

INSERT INTO Foods (OwnerID, FoodName, FoodPrice, OriginalPrice, ImageName, LastUpdatedDate)
VALUES (3, 'Bánh mì việt nam', 20000, 18000, 'banhmivn.jpg', 1593097162689);

INSERT INTO Foods (OwnerID, FoodName, FoodPrice, OriginalPrice, ImageName, LastUpdatedDate)
VALUES (3, 'Cơm gà xôi mỡ', 25000, 20000, 'comgaxm.jpg', 1593097162699);

INSERT INTO Foods (OwnerID, FoodName, FoodPrice, OriginalPrice, ImageName, LastUpdatedDate)
VALUES (3, 'Hamburger Bò', 20000, 17000, 'bugerbo.jpg', 1593097162709);

UPDATE Foods
SET FoodState = 1
WHERE FoodID = 1 AND OwnerID = 3;

UPDATE Foods
SET FoodState = 1
WHERE FoodID = 2 AND OwnerID = 3;

UPDATE Foods
SET FoodState = 1
WHERE FoodID = 3 AND OwnerID = 3;

INSERT INTO Carts (FoodID, CustomerID)
VALUES (1, 2);

INSERT INTO Carts (FoodID, CustomerID)
VALUES (2, 2);

UPDATE Carts
SET NumberOfCart = NumberOfCart + 1
WHERE FoodID = 2 AND CustomerID = 2;

UPDATE Carts
SET CartState = 0
WHERE CartID = 1 AND CustomerID = 2 AND CartState = 1;

INSERT INTO Orders (CreatedDate)
VALUES (1593097162719);

UPDATE Carts
SET OrderID = 1, CartState = 2
WHERE CustomerID = 2 AND CartState = 1;

UPDATE Carts
SET CartState = 3
WHERE CartID = 2 AND CartState = 2;

UPDATE Carts
SET CartState = 4
WHERE CartID = 2 AND CartState = 3;
`;
db.exec(sql, function(err){if(err)console.log(err.message);});
