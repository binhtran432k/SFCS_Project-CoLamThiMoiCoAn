'use strict'
const sha256 = require('sha256');
const CustomerView = require('./customer.view');
const CustomerDB = require('./customer.db');

module.exports = class CustomerController {
    static controlRegister(req, res, next) {
        CustomerView.viewRegister(req, res);
    }
    static registerCustomer(data, callback) {
		data.hash = sha256(data.password);
        CustomerDB.createCustomer(data, function(err){
            if (err) {
				if (err.errorFail) console.log(err);
                callback({
                    message: err.message
                });
                return;
			}
			callback();
        });
    }
}