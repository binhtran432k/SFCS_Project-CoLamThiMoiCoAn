'use strict'

module.exports = class CartView {
    static viewCart(req, res) {
	   	const userData = req.session.userData || {};
        res.render('cart.view/cart', {
            title: 'Giỏ hàng',
		    loggedin: req.session.loggedin,
		    userName: userData.UserName,
		    userType: userData.UserType
        });
    }
}