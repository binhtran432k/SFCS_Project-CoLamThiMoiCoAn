'use strict';
const ActionHandling = require('../business-logic/action.handling');
const BusyHandling = require('../business-logic/busy.handling');

const FoodManagementController = require('../business-logic/food.management.controller');

function foodIo(socket, io) {
    socket.on('clientGetListAllFoods', function () {
        FoodManagementController.getListAllFoods(function (actionNo, messageEmit, errorNo, foods) {
            ActionHandling.doAction(actionNo, messageEmit, {
                errorNo: errorNo,
                foods: foods
            }, io, socket);
        })
    });
}

module.exports = { foodIo };