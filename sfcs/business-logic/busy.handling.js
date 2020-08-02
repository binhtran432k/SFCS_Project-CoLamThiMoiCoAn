'use strict'
let busy = {};
let sessionBusy = {};

module.exports = class BusyHandling {
    static checkBusy(userId) {
        return busy[userId];
    }
    static addBusy(userId) {
        busy[userId] = true;
    }
    static removeBusy(userId) {
        delete busy[userId];
    }
    static checkSessionBusy(sessionId) {
        return sessionBusy[sessionId];
    }
    static addSessionBusy(sessionId) {
        sessionBusy[sessionId] = true;
    }
    static removeSessionBusy(sessionId) {
        delete sessionBusy[sessionId];
    }
}