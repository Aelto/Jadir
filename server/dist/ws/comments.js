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
    ws.on(endpoints_1.endpoints.getPostComments, (wsClient, message) => __awaiter(this, void 0, void 0, function* () {
        const id = message.message.id || 0;
        try {
            const results = yield db_query_1.default(con, `SELECT c.*, u.name as author FROM comments as c
         LEFT JOIN users as u on c.author_id = u.id
         WHERE c.id=?`, [id]);
            ws.answer(wsClient, endpoints_1.endpoints.getPostComments, { comments: results });
        }
        catch (err) {
            ws.answer(wsClient, endpoints_1.endpoints.getPostComments, {}, interfaces.MessageState.databaseError);
        }
    }));
}
exports.default = default_1;
