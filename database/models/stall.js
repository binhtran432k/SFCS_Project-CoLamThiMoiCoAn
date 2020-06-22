"use strict"
class Stall {
    #idStall;
    #email;
    #nameOfStall;
    #nameOfOwner;
    #owner;
    #createdDay;
    #preHash;
    #valid;
    constructor(userParam) {
        this.#idStall = userParam.idStall;
        this.#email = userParam.email;
        this.#nameOfStall = userParam.nameOfStall;
        this.#nameOfOwner = userParam.nameOfOwner;
        this.#owner = userParam.owner;
        this.#createdDay = userParam.createdDay;
        this.#preHash = userParam.preHash;
        this.#valid = userParam.valid;
    }
    getPreHash() {
        return this.#preHash;
    }
    checkExist() {
        return !(
            this.#idStall === undefined
            && this.#email === undefined
            && this.#nameOfStall === undefined
            && this.#nameOfOwner === undefined
            && this.#owner === undefined
            && this.#createdDay === undefined
            && this.#preHash === undefined
            && this.#valid === undefined
        );
    }
    verify(param) {
        return (
            this.#idStall === param.idStall
            && this.#email === param.email
            && this.#nameOfStall === param.nameOfStall
            && this.#nameOfOwner.first === param.nameOfOwner.first
            && this.#nameOfOwner.middle === param.nameOfOwner.middle
            && this.#nameOfOwner.last === param.nameOfOwner.last
            && this.#owner === param.owner
        );
    }
    toJSON(){
        return {
            idStall: this.#idStall,
            nameOfStall: this.#nameOfStall,
            nameOfOwner: this.#nameOfOwner,
            owner: this.#owner,
            createdDay: this.#createdDay,
            valid: this.#valid,
        };
    }
}
module.exports = Stall;
