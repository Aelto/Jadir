"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces = require("../shared/interfaces");
const endpoints_1 = require("../shared/endpoints");
const db_query_1 = require("../db-query");
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const key = "private";
const hashPassword = pwd => crypto.createHash('sha512', key).update(pwd).digest('base64');
function default_1(ws, con) {
    ws.on(endpoints_1.endpoints.signup, (wsClient, message) => __awaiter(this, void 0, void 0, function* () {
        let alreadyExistingUser = null;
        try {
            alreadyExistingUser = yield db_query_1.default(con, `SELECT * FROM users WHERE name = ?`, [message.message.login]);
        }
        catch (err) {
            return ws.answer(wsClient, endpoints_1.endpoints.signup, {}, interfaces.MessageState.databaseError);
        }
        if (alreadyExistingUser.length) {
            ws.answer(wsClient, endpoints_1.endpoints.signup, { success: false, message: 'user-already-exists' }, interfaces.MessageState.databaseError);
        }
        else {
            try {
                yield db_query_1.default(con, `INSERT INTO users (name, password, role) VALUES (?, ?, ?)`, [message.message.login, hashPassword(message.message.password), interfaces.UserRole.standard]);
                return ws.answer(wsClient, endpoints_1.endpoints.signup, { success: true, message: null });
            }
            catch (err) {
                return ws.answer(wsClient, endpoints_1.endpoints.signup, {}, interfaces.MessageState.databaseError);
            }
        }
    }));
    ws.on(endpoints_1.endpoints.signin, (wsClient, message) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield db_query_1.default(con, `SELECT * from users WHERE name = ? AND password = ?`, [message.message.login, hashPassword(message.message.password)]);
            if (user.length) {
                const token = uuidv4();
                yield db_query_1.default(con, `UPDATE users
           SET token = ?
           WHERE name = ?`, [token, message.message.login]);
                ws.clients.authentifyUser(message.token, message.message.login);
                ws.answer(wsClient, endpoints_1.endpoints.signin, { login: message.message.login, success: true, token });
            }
            else {
                ws.answer(wsClient, endpoints_1.endpoints.signin, { login: '', success: false }, interfaces.MessageState.notFound);
            }
        }
        catch (err) {
            ws.answer(wsClient, endpoints_1.endpoints.signin, {}, interfaces.MessageState.databaseError);
        }
    }));
    ws.on(endpoints_1.endpoints.signinToken, (wsClient, message) => __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield db_query_1.default(con, `SELECT * FROM users WHERE name = ? AND token = ?`, [message.message.login, message.message.token]);
            if (users.length) {
                ws.clients.authentifyUser(message.token, message.message.login);
                ws.answer(wsClient, endpoints_1.endpoints.signinToken, {
                    login: message.message.login,
                    success: true,
                    token: message.message.token
                });
            }
            else {
                ws.answer(wsClient, endpoints_1.endpoints.signinToken, { login: '', success: false }, interfaces.MessageState.notFound);
            }
        }
        catch (err) {
            ws.answer(wsClient, endpoints_1.endpoints.signinToken, {}, interfaces.MessageState.databaseError);
        }
    }));
}
exports.default = default_1;
