"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints_1 = require("../shared/endpoints");
function default_1(ws, con) {
    ws.on(endpoints_1.endpoints.move, (wsClient, message) => {
        if (!message.token)
            return;
        ws.clients.updateState(ws.clients.getUser(message.token), message.message.newState);
    });
}
exports.default = default_1;
