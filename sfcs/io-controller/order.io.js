'use strict';
const ActionHandling = require('../business-logic/action.handling');
const BusyHandling = require('../business-logic/busy.handling');

const OrderManagementController = require('../business-logic/order.management.controller');
const CartManagementController = require('../business-logic/cart.management.controller');

function orderIo(socket, io) {
    socket.on('clientMakeOrder', function () {
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
            OrderManagementController.makeOrder(function (actionNo, messageEmit, errorNo, orderId) {
                ActionHandling.doAction(actionNo, messageEmit, {
                    errorNo: errorNo
                }, io, socket);
                CartManagementController.makeCartBePayment(userData.UserID, orderId, function (actionNo, messageEmit, errorNo, ownerId) {
                    ActionHandling.doAction(actionNo, messageEmit, {
                        errorNo: errorNo,
                        ownerId: ownerId
                    }, io, socket);
                    BusyHandling.removeBusy(userData.UserID);
                });
            });
        }
    });
    socket.on('clientGetListAllOrderToProccess', function () {
        if (socket.handshake.session.loggedin) {
            let userData = socket.handshake.session.userData || {};
            if (userData.UserType !== 1) {
                return ActionHandling.doAction(0, 'serverSendMessage', {
                        errorNo: 14
                    },
                    io, socket);
            }
            if (BusyHandling.checkCookBusy(userData.OwnerID)) {
                return ActionHandling.doAction(0, 'serverSendMessage', {
                        errorNo: 5
                    },
                    io, socket);
            }
            BusyHandling.addCookBusy(userData.OwnerID);
            OrderManagementController.getListAllOrderToProccess(userData.OwnerID,
                function (actionNo, messageEmit, errorNo, orders) {
                    ActionHandling.doAction(actionNo, messageEmit, {
                        errorNo: errorNo,
                        orders: orders
                    }, io, socket);
                    BusyHandling.removeCookBusy(userData.OwnerID);
                });
        }
    });
}

module.exports = {
    orderIo
};