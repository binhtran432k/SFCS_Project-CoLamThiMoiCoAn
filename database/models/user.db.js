"use strict"
const db = require('../config/config.firebase');
const User = require('./user');
const Stall = require('./stall');
const { urlencoded } = require('body-parser');

class UserDB {
    static async getUserByUsername(username) {
        return await db.ref('users')
            .orderByChild('username').equalTo(username)
            .once('value').then(snap => {
                let userParam;
                if (!snap.exists()) {
                    userParam = {};
                } else {
                    let key = Object.keys(snap.toJSON())[0];
                    userParam = snap.toJSON()[key];
                    userParam.id = key;
                }
                return new User(userParam);
            });
    }
    static async getUserByEmail(email) {
        return await db.ref('users')
            .orderByChild('email').equalTo(email)
            .once('value').then(snap => {
                let userParam;
                if (!snap.exists()) {
                    userParam = {};
                } else {
                    let key = Object.keys(snap.toJSON())[0];
                    userParam = snap.toJSON()[key];
                    userParam.id = key;
                }
                return new User(userParam);
            });
    }
    static async getUserById(id) {
        return await db.ref('users').child(id)
            .once('value').then(snap => {
                let userParam;
                if (!snap.exists()) {
                    userParam = {};
                } else {
                    userParam = snap.val();
                    userParam.id = snap.key;
                }
                return new User(userParam);
            });
    }
    static async getStallByNameOfStall(nameOfStall) {
        return await db.ref('stalls')
            .orderByChild('nameOfStall').equalTo(nameOfStall)
            .once('value').then(snap => {
                let param;
                if (!snap.exists()) {
                    param = {};
                } else {
                    let key = Object.keys(snap.toJSON())[0];
                    param = snap.toJSON()[key];
                    param.idStall = key;
                }
                return new Stall(param);
            });
    }
    static async getStallByIdStall(idStall) {
        return await db.ref('stalls').child(idStall)
            .once('value').then(snap => {
                let param;
                if (!snap.exists()) {
                    param = {};
                } else {
                    param = snap.val();
                    param.idStall = snap.key;
                }
                return new Stall(param);
            });
    }
    static async createCustomer(userParam) {
        // validate
        let user = await this.getUserByEmail(userParam.email);
        if (user.checkExist()) {
            throw 'Email "' + userParam.email + '" đã tồn tại';
        }

        // save user
        let id = await db.ref('users').push();
        let saveUser = {
            ["users/" + id.key + "/email"]: userParam.email,
            ["users/" + id.key + "/name"]: userParam.name,
            ["users/" + id.key + "/hash"]: userParam.hash,
            ["users/" + id.key + "/valid"]: userParam.valid,
            ["users/" + id.key + "/userType"]: userParam.userType,
            ["users/" + id.key + "/createdDay"]: userParam.createdDay,
        };
        await db.ref().update(saveUser);
    }
    static async authenticate({ email, password }) {
        let user = await this.getUserByEmail(email);
        if (user.toJSON().valid !== 1) {
            return;
        }
        if (user.comparePassword(password)) {
            return {
                ...user.toJSON()
            }
        }
    }
    static async removeCustomer(userParam) {
        let username = userParam.username;
        let user = await this.getUserByUsername(username);
        let verifyUser = user.verify(userParam);
        if (!verifyUser) {
            throw 'Đã có lỗi xảy ra, hãy đăng xuất và đăng nhập lại để thử lại nếu vẫn tiếp tục xảy ra vui lòng liên hệ Quản Lý để giải quyêt';
        }
        if (!user.checkExist()) {
            throw 'Tài khoản "' + username + '" không tồn tại';
        }
        let removeUser = {
            ["users/" + user.toJSON().id]: null,
            ["usersInfo/" + username]: null
        };
        await db.ref().update(removeUser);
    }
    static async createPreOwner(userParam, desParam) {
        let username = userParam.username;
        let user = await this.getUserByUsername(username);
        let verifyUser = user.verify(userParam);
        if (!verifyUser) {
            throw 'Đã có lỗi xảy ra, hãy đăng xuất và đăng nhập lại để thử lại nếu vẫn tiếp tục xảy ra vui lòng liên hệ Quản Lý để giải quyêt';
        }
        // validate
        let stall = await this.getStallByNameOfStall(desParam.nameOfStall);
        if (stall.checkExist()) {
            throw 'Cửa hàng "' + desParam.nameOfStall + '" đã tồn tại';
        }
        // pre save vendor owner
        let id = await db.ref('users').push();
        let idStall = await db.ref('stalls').push();
        let updateData = {
            ["users/" + id.key + "/valid"]: desParam.valid,
            ["users/" + id.key + "/userType"]: desParam.userType,
            ["stalls/" + idStall.key + "/preHash"]: desParam.preHash,
            ["stalls/" + idStall.key + "/owner"]: id.key,
            ["stalls/" + idStall.key + "/nameOfStall"]: desParam.nameOfStall,
            ["stalls/" + idStall.key + "/nameOfOwner"]: desParam.nameOfOwner,
            ["stalls/" + idStall.key + "/email"]: desParam.email,
            ["stalls/" + idStall.key + "/createdDay"]: desParam.createdDay,
            ["stalls/" + idStall.key + "/valid"]: desParam.valid,
            ["orders/" + idStall.key + "/valid"]: desParam.valid,
            ["cooks/" + idStall.key + "/valid"]: desParam.valid,
            ["foods/" + idStall.key + "/valid"]: desParam.valid,
        };
        await db.ref().update(updateData);
        return {
            id: idStall.key,
            key: desParam.preHash
        }
    }
    static async removePreOwner(userParam, desParam) {
        let username = userParam.username;
        let user = await this.getUserByUsername(username);
        let verifyUser = user.verify(userParam);
        if (!verifyUser) {
            throw 'Đã có lỗi xảy ra, hãy đăng xuất và đăng nhập lại để thử lại nếu vẫn tiếp tục xảy ra vui lòng liên hệ Quản Lý để giải quyêt';
        }
        // validate
        let stall = await this.getStallByNameOfStall(desParam.nameOfStall);
        if (!stall.checkExist()) {
            throw 'Cửa hàng "' + desParam.nameOfStall + '" không tồn tại';
        }
        if (stall.toJSON().valid !== 3) {
            throw 'Truy cập bị từ chối';
        }
        if (!stall.verify(desParam)) {
            throw 'Đã có lỗi xảy ra, vui lòng thử lại sau';
        }
        // remove pre vendor owner
        let id = stall.toJSON().owner;
        let idStall = stall.toJSON().idStall;
        let updateData = {
            ["users/" + id]: null,
            ["stalls/" + idStall]: null,
            ["orders/" + idStall]: null,
            ["cooks/" + idStall]: null,
            ["foods/" + idStall]: null,
        };
        await db.ref().update(updateData);
    }
    static async getAllStall() {
        let stalls = {};
        return await db.ref('stalls').once('value')
            .then(snap => {
                let i = 0;
                snap.forEach(child => {
                    //stalls[child.key] = child.val();
                    let stall = child.val();
                    stall.idStall = child.key;
                    stalls[i] = stall;
                    i++;
                });
                return stalls;
            });
    }
    static async createOwner(userParam) {
        // validate
        let user = await this.getUserByUsername(userParam.username);
        if (user.checkExist()) {
            throw 'Tài khoản "' + userParam.username + '" đã tồn tại';
        }
        let stall = await this.getStallByIdStall(userParam.idStall);
        
        if (stall.toJSON().valid !== 3 || !stall.checkExist() || stall.getPreHash() !== userParam.preHash) {
            throw 'Truy cập bị từ chối';
        }
        // save user
        let id = stall.toJSON().owner;
        let saveUser = {
            ["users/" + id + "/username"]: userParam.username,
            ["users/" + id + "/hash"]: userParam.hash,
            ["users/" + id + "/valid"]: userParam.valid,
            ["usersInfo/" + userParam.username + "/id"]: id,
            ["usersInfo/" + userParam.username + "/createdDay"]: userParam.createdDay,
            ["stalls/" + stall.toJSON().idStall + "/preHash"]: null,
            ["stalls/" + stall.toJSON().idStall + "/valid"]: userParam.valid,
            ["cooks/" + stall.toJSON().idStall + "/valid"]: userParam.valid,
            ["foods/" + stall.toJSON().idStall + "/valid"]: userParam.valid,
            ["orders/" + stall.toJSON().idStall + "/valid"]: userParam.valid,
        };
        await db.ref().update(saveUser);
    }
    static async acceptOwner(userParam, desParam) {
        let username = userParam.username;
        let user = await this.getUserByUsername(username);
        let verifyUser = user.verify(userParam);
        if (!verifyUser) {
            throw 'Đã có lỗi xảy ra, hãy đăng xuất và đăng nhập lại để thử lại nếu vẫn tiếp tục xảy ra vui lòng liên hệ Quản Lý để giải quyêt';
        }
        // validate
        let stall = await this.getStallByNameOfStall(desParam.nameOfStall);
        if (!stall.checkExist()) {
            throw 'Cửa hàng "' + desParam.nameOfStall + '" không tồn tại';
        }
        if (stall.toJSON().valid !== 2) {
            throw 'Truy cập bị từ chối';
        }
        if (!stall.verify(desParam)) {
            throw 'Đã có lỗi xảy ra, vui lòng thử lại sau';
        }
        // accept vendor owner
        let id = stall.toJSON().owner;
        let idStall = stall.toJSON().idStall;
        let updateData = {
            ["users/" + id + "/valid"]: 1,
            ["stalls/" + idStall + "/valid"]: 1,
            ["cooks/" + idStall + "/valid"]: 1,
            ["foods/" + idStall + "/valid"]: 1,
            ["orders/" + idStall + "/valid"]: 1,
        };
        await db.ref().update(updateData);
    }
    static async disableOwner(userParam, desParam) {
        let username = userParam.username;
        let user = await this.getUserByUsername(username);
        let verifyUser = user.verify(userParam);
        if (!verifyUser) {
            throw 'Đã có lỗi xảy ra, hãy đăng xuất và đăng nhập lại để thử lại nếu vẫn tiếp tục xảy ra vui lòng liên hệ Quản Lý để giải quyêt';
        }
        // validate
        let stall = await this.getStallByNameOfStall(desParam.nameOfStall);
        if (!stall.checkExist()) {
            throw 'Cửa hàng "' + desParam.nameOfStall + '" không tồn tại';
        }
        if (stall.toJSON().valid !== 1) {
            throw 'Truy cập bị từ chối';
        }
        if (!stall.verify(desParam)) {
            throw 'Đã có lỗi xảy ra, vui lòng thử lại sau';
        }
        // accept vendor owner
        let id = stall.toJSON().owner;
        let idStall = stall.toJSON().idStall;
        let updateData = {
            ["users/" + id + "/valid"]: 0,
            ["stalls/" + idStall + "/valid"]: 0,
            ["cooks/" + idStall + "/valid"]: 0,
            ["foods/" + idStall + "/valid"]: 0,
            ["orders/" + idStall + "/valid"]: 0,
        };
        await db.ref().update(updateData);
    }
    static async deleteOwner(userParam, desParam) {
        let username = userParam.username;
        let user = await this.getUserByUsername(username);
        let verifyUser = user.verify(userParam);
        if (!verifyUser) {
            throw 'Đã có lỗi xảy ra, hãy đăng xuất và đăng nhập lại để thử lại nếu vẫn tiếp tục xảy ra vui lòng liên hệ Quản Lý để giải quyêt';
        }
        // validate
        let stall = await this.getStallByNameOfStall(desParam.nameOfStall);
        if (!stall.checkExist()) {
            throw 'Cửa hàng "' + desParam.nameOfStall + '" không tồn tại';
        }
        if (stall.toJSON().valid !== 0) {
            throw 'Truy cập bị từ chối';
        }
        if (!stall.verify(desParam)) {
            throw 'Đã có lỗi xảy ra, vui lòng thử lại sau';
        }
        let owner = await this.getUserById(stall.toJSON().owner);
        // accept vendor owner
        let id = stall.toJSON().owner;
        let idStall = stall.toJSON().idStall;
        let updateData = {
            ["users/" + id]: null,
            ["users/" + owner.toJSON().username]: null,
            ["stalls/" + idStall]: null,
            ["cooks/" + idStall]: null,
            ["foods/" + idStall]: null,
            ["orders/" + idStall]: null,
        };
        await db.ref().update(updateData);
    }
}

module.exports = UserDB;
