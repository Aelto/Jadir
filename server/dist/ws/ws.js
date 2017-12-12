"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_manager_1 = require("../ws-manager");
const state_update_1 = require("./state-update");
const posts_1 = require("./posts");
const comments_1 = require("./comments");
const account_1 = require("./account");
function default_1(app, con) {
    const ws = new ws_manager_1.default();
    const inactivityInterval = setInterval(() => {
        ws.clients.removeInactiveUsers(1000 * 60 * 24); // inactive for 24 minutes 
    }, 1000 * 60); // every minute
    state_update_1.default(ws, con);
    posts_1.default(ws, con);
    comments_1.default(ws, con);
    account_1.default(ws, con);
    return ws;
}
exports.default = default_1;
