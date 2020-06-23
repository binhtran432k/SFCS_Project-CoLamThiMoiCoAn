const express = require('express');

const FakeEmail = express.Router();

// routes
FakeEmail.get('/fake-email', viewLogin);

module.exports = FakeEmail;

function viewLogin(req, res, next) {
	res.render('external-system/fake-email/login');
}