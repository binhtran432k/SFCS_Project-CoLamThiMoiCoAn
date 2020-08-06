'use strict';
const ActionHandling = require('../business-logic/action.handling');
const BusyHandling = require('../business-logic/busy.handling');

const UserManagementController = require('../business-logic/user.management.controller');

function userIo(socket, io) {
    socket.on('clientLogout', function () {
        ActionHandling.doAction(3, null, {}, io, socket);
    });
    socket.on('clientLogin', function (data) {
        if (!socket.handshake.session.loggedin) {
            UserManagementController.authenticate(data.loginName, data.password,
                function (actionNo, messageEmit, errorNo, user) {
                    if (actionNo === 2 && user.UserType === 2) {}
                    ActionHandling.doAction(actionNo, messageEmit, {
                            errorNo: errorNo,
                            user: user
                        },
                        io, socket);
                });
        }
    });
    socket.on('clientRegister', function (data) {
        if (!socket.handshake.session.loggedin) {
            let sessionId = socket.handshake.session.id;
            if (BusyHandling.checkSessionBusy(sessionId)) {
                return ActionHandling.doAction(0, 'serverSendMessage', {
                        errorNo: 5
                    },
                    io, socket);
            }
            BusyHandling.addSessionBusy(sessionId);
            UserManagementController.register(data.userName, data.email,
                data.loginName, data.password, data.retypePassword,
                function (actionNo, messageEmit, errorNo) {
                    ActionHandling.doAction(actionNo, messageEmit, {
                            errorNo: errorNo
                        },
                        io, socket);
                    BusyHandling.removeSessionBusy(sessionId);
                });
        }
    });
}

module.exports = { userIo };