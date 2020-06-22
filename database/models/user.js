"use strict"
const sha256 = require('sha256');

class User {
    #id;
    #username;
    #hash;
    #userType;
    #createdDay;
    #valid;
    constructor(userParam) {
        this.#id = userParam.id;
        this.#username = userParam.username;
        this.#hash = userParam.hash;
        this.#createdDay = userParam.createdDay;
        this.#userType = userParam.userType;
        this.#valid = userParam.valid;
    }
    comparePassword(password) {
        return this.#hash === sha256(password);
    }
    checkExist() {
        return !(
            this.#id === undefined
            && this.#username === undefined
            && this.#hash === undefined
            && this.#createdDay === undefined
            && this.#userType === undefined
            && this.#valid === undefined
        );
    }
    verify(param) {
        return (
            this.#id === param.id
            && this.#hash === param.hash
            && this.#userType === param.userType
        );
    }
    toJSON(){
        return {
            id: this.#id,
            username: this.#username,
            hash: this.#hash,
            createdDay: this.#createdDay,
            userType: this.#userType,
            valid: this.#valid
        };
    }
}
module.exports = User;
