"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_user_map_1 = require("./token-user-map");
const interfaces = require("./shared/interfaces");
class WsManager {
    constructor() {
        this.events = {};
        this.clients = new token_user_map_1.default();
    }
    on(name, fn) {
        this.events[name] = fn;
        return this;
    }
    _onmessage(message, ws) {
        if (message.token && this.clients.doesUserExist(message.token)) {
            message.isAuth = this.clients.isUserAuth(message.token, message.login);
            this.clients.updateActivity(message.token);
        }
        this.emit(message.title, message, ws);
    }
    emit(name, obj, ws) {
        const chosenEvent = this.events[name];
        if (chosenEvent && typeof chosenEvent === 'function') {
            chosenEvent(ws, obj);
        }
    }
    send(wsClient, name, message, state, thenableId = null) {
        wsClient.send(JSON.stringify({ title: name, message: message, state, thenableId }));
    }
    answer(wsClient, name, message, state = interfaces.MessageState.success, thenableId = null) {
        this.send(wsClient, name + '-done', message, state, thenableId);
    }
    accept(app, path) {
        this.on('synchronize', (wsClient, message) => {
            const token = this.clients.addUser(wsClient);
            this.answer(wsClient, 'synchronize', { token });
        });
        this.on('login', (wsClient, message) => {
        });
        app.ws(path, (ws, req) => {
            ws.on('message', (message) => {
                this._onmessage(JSON.parse(message), ws);
            });
        });
        return this;
    }
}
exports.default = WsManager;
