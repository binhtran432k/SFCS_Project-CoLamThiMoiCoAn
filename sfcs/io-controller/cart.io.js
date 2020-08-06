'use strict';
const ActionHandling = require('../business-logic/action.handling');
const BusyHandling = require('../business-logic/busy.handling');

const CartManagementController = require('../business-logic/cart.management.controller');

function cartIo(socket, io) {
    socket.on('clientGetNumCartToPay', function () {
        if (socket.handshake.session.loggedin) {
            let userData = socket.handshake.session.userData || {};
            CartManagementController.getNumCartToPayByUserId(userData.UserID,
                function (actionNo, messageEmit, errorNo, numCartToPay) {
                    ActionHandling.doAction(actionNo, messageEmit, {
                        errorNo: errorNo,
                        numCartToPay: numCartToPay
                    }, io, socket);
                });
        }
    });
    socket.on('clientAddToCart', function (data) {
        if (socket.handshake.session.loggedin) {
            let userData = socket.handshake.session.userData || {};
            if (userData.UserType !== 0) {
                return ActionHandling.doAction(0, 'serverSendMessage', {
                        errorNo: 13
                    },
                    io, socket);
            }
            if (BusyHandling.checkBusy(userData.UserID)) {
                return ActionHandling.doAction(0, 'serverSendMessage', {
                        errorNo: 5
                    },
                    io, socket);
            }
            BusyHandling.addBusy(userData.UserID);
            CartManagementController.addToCart(parseInt(data.foodId), userData.UserID,
                function (actionNo, messageEmit, errorNo) {
                    ActionHandling.doAction(actionNo, messageEmit, {
                            errorNo: errorNo
                        },
                        io, socket);
                    BusyHandling.removeBusy(userData.UserID);
                });
        } else {
            return ActionHandling.doAction(0, 'serverSendMessage', {
                    errorNo: 9
                },
                io, socket);
        }
    });
    socket.on('clientGetListCartToPay', function () {
        if (socket.handshake.session.loggedin) {
            if (socket.handshake.session.userData.UserType !== 0) {
                return ActionHandling.doAction(0, 'serverSendMessage', {
                        errorNo: 13
                    },
                    io, socket);
            }
            CartManagementController.getCartToPay(
                socket.handshake.session.userData.UserID,
                function (actionNo, messageEmit, errorNo, carts) {
                    ActionHandling.doAction(actionNo, messageEmit, {
                        errorNo: errorNo,
                        carts: carts
                    }, io, socket);
                });
        }
    });
    socket.on('clientRemoveCart', function (data) {
        if (socket.handshake.session.loggedin) {
            let userData = socket.handshake.session.userData || {};
            if (userData.UserType !== 0) {
                return ActionHandling.doAction(0, 'serverSendMessage', {
                        errorNo: 13
                    },
                    io, socket);
            }
            if (BusyHandling.checkBusy(userData.UserID)) {
                return ActionHandling.doAction(0, 'serverSendMessage', {
                        errorNo: 5
                    },
                    io, socket);
            }
            BusyHandling.addBusy(userData.UserID);
            CartManagementController.removeCart(
                parseInt(data.cartId),
                function (actionNo, messageEmit, errorNo) {
                    ActionHandling.doAction(actionNo, messageEmit, {
                        errorNo: errorNo
                    }, io, socket);
                    BusyHandling.removeBusy(userData.UserID);
                });
        }
    });
    socket.on('clientChangeCart', function (data) {
        if (socket.handshake.session.loggedin) {
            let userData = socket.handshake.session.userData || {};
            if (userData.UserType !== 0) {
                return ActionHandling.doAction(0, 'serverSendMessage', {
                        errorNo: 13
                    },
                    io, socket);
            }
            if (BusyHandling.checkBusy(userData.UserID)) {
                return ActionHandling.doAction(0, 'serverSendMessage', {
                        errorNo: 5
                    },
                    io, socket);
            }
            BusyHandling.addBusy(userData.UserID);
            CartManagementController.changeCart(
                parseInt(data.cartId), data.numToChange,
                function (actionNo, messageEmit, errorNo) {
                    ActionHandling.doAction(actionNo, messageEmit, {
                        errorNo: errorNo
                    }, io, socket);
                    BusyHandling.removeBusy(userData.UserID);
                });
        }
    });
}

module.exports = {
    cartIo
};