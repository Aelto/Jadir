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
function default_1(ws, con) {
    ws.on(endpoints_1.endpoints.setUserImage, (wsClient, message) => __awaiter(this, void 0, void 0, function* () {
        if (!message.isAuth) {
            return ws.answer(wsClient, endpoints_1.endpoints.setUserImage, {}, interfaces.MessageState.unauthorized);
        }
        try {
            const results = yield db_query_1.default(con, `UPDATE users SET image_url = ? WHERE name = ?`, [message.message.image_url, message.login]);
            ws.answer(wsClient, endpoints_1.endpoints.setUserImage, { image_url: message.message.image_url });
        }
        catch (err) {
            ws.answer(wsClient, endpoints_1.endpoints.setUserImage, {}, interfaces.MessageState.databaseError);
        }
    }));
    ws.on(endpoints_1.endpoints.getUserProfile, (wsClient, message) => __awaiter(this, void 0, void 0, function* () {
        try {
            const results = yield db_query_1.default(con, `SELECT * FROM users WHERE name = ?`, [message.message.username]);
            if (!results.length) {
                ws.answer(wsClient, endpoints_1.endpoints.getUserProfile, {}, interfaces.MessageState.notFound);
            }
            const user = results[0];
            if (user.password)
                delete user.password;
            ws.answer(wsClient, endpoints_1.endpoints.getUserProfile, { user });
        }
        catch (err) {
            ws.answer(wsClient, endpoints_1.endpoints.getUserProfile, {}, interfaces.MessageState.databaseError);
        }
    }));
}
exports.default = default_1;