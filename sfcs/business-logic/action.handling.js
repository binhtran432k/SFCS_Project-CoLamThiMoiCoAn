'use strict'
const ErrorHandling = require('./error.handling');

module.exports = class ActionHandling {
    static doAction (actionNo, messageEmit, data, io, socket) {
        data.message = ErrorHandling.getError(data.errorNo);
        switch (actionNo) {
            case 0:
                socket.emit(messageEmit, data);
                break;
            case 1:
                socket.emit(messageEmit);
                break;
            case 2:
                socket.handshake.session.loggedin = true;
                socket.handshake.session.userData = data.user;
                socket.handshake.session.save();
                io.sockets.in('SessionID' + socket.handshake.session.id).emit('serverSendRedirectHome');
                break;
            case 3:
                if (socket.handshake.session.loggedin) {
                    delete socket.handshake.session.loggedin;
                    delete socket.handshake.session.userData;
                    socket.handshake.session.save();
                }
                io.sockets.in('SessionID' + socket.handshake.session.id).emit(
                    'serverSendRedirectHome'
                );
                break;
            case 4:
                io.sockets.in('UserID' + socket.handshake.session.userData.UserID).emit(
                    messageEmit, data
                );
                break;
            case 5:
                io.sockets.in('SessionID' + socket.handshake.session.id).emit(
                    messageEmit, data
                );
                break;
            case 6:
                break;
            case 7:
                io.sockets.in('StallCook' + data.ownerId).emit(
                    messageEmit, data
                );
                break;
            default:
                socket.emit('serverSendMessage', 'Lỗi không xác định');
        }
    }
}