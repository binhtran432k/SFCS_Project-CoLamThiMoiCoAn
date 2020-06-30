'use strict'

module.exports = class User {
    #userId;
    #email;
    #loginName;
    #hash;
    #userName;
    #userType;
    #createdDate;
    #valid;
    constructor(data){
        this.#userId = data.UserID;
        this.#email = data.Email;
        this.#loginName = data.LoginName;
        this.#hash = data.Hash;
        this.#userName = data.UserName;
        this.#userType = data.UserType;
        this.#createdDate = data.CreatedDate;
        this.#valid = data.Valid;
    }
    toJSON(){
        return {
            userId: this.#userId,
            email: this.#email,
            loginName: this.#loginName,
            hash: this.#hash,
            userName: this.#userName,
            userType: this.#userType,
            createdDate: this.#createdDate,
            valid: this.#valid
        }
    }
}