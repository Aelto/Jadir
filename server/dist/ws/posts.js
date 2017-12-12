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
    ws.on(endpoints_1.endpoints.getPagePosts, (wsClient, message) => __awaiter(this, void 0, void 0, function* () {
        const page = message.message.page || 0;
        try {
            const results = yield db_query_1.default(con, `SELECT * FROM posts ORDER BY date DESC LIMIT ?, ?`, [page * 20, page + 20]);
            ws.answer(wsClient, endpoints_1.endpoints.getPagePosts, { posts: results });
        }
        catch (err) {
            ws.answer(wsClient, endpoints_1.endpoints.getPagePosts, {}, interfaces.MessageState.databaseError);
        }
    }));
    ws.on(endpoints_1.endpoints.getPost, (wsClient, message) => __awaiter(this, void 0, void 0, function* () {
        let id = 0;
        if (message.message.id && message.message.id > 0)
            id = message.message.id;
        try {
            const results = yield db_query_1.default(con, `SELECT * FROM posts where id = ?`, [id]);
            if (results.length) {
                ws.answer(wsClient, endpoints_1.endpoints.getPost, { post: results[0] });
            }
            else {
                ws.answer(wsClient, endpoints_1.endpoints.getPost, {}, interfaces.MessageState.notFound);
            }
        }
        catch (err) {
            ws.answer(wsClient, endpoints_1.endpoints.getPost, {}, interfaces.MessageState.databaseError);
        }
    }));
    ws.on(endpoints_1.endpoints.newPost, (wsClient, message) => __awaiter(this, void 0, void 0, function* () {
        if (!message.isAuth) {
            return ws.answer(wsClient, endpoints_1.endpoints.newPost, {}, interfaces.MessageState.unauthorized);
        }
        let user = null;
        try {
            const results = yield db_query_1.default(con, 'SELECT * FROM users WHERE name = ?', [message.login]);
            if (!results.length) {
                return ws.answer(wsClient, endpoints_1.endpoints.newPost, {}, interfaces.MessageState.unauthorized);
            }
            user = results[0];
        }
        catch (err) {
            return ws.answer(wsClient, endpoints_1.endpoints.newPost, {}, interfaces.MessageState.databaseError);
        }
        let results;
        try {
            results = yield db_query_1.default(con, `INSERT INTO posts (title, date, author_id, content, tags, author, score, image_url)
         VALUES (?, ?, ?, ?, ?, ?, 0, ?)`, [message.message.title, new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace('T', ' '), user.id, message.message.content, message.message.tags, user.name, message.message.image_url]);
        }
        catch (err) {
            ws.answer(wsClient, endpoints_1.endpoints.newPost, {}, interfaces.MessageState.databaseError);
        }
        try {
            const posts = yield db_query_1.default(con, `SELECT * FROM posts where id = ?`, [results.insertId]);
            if (posts.length) {
                ws.answer(wsClient, endpoints_1.endpoints.newPost, {
                    post: posts[0]
                });
            }
            else {
                ws.answer(wsClient, endpoints_1.endpoints.newPost, {}, interfaces.MessageState.databaseError);
            }
        }
        catch (err) {
            ws.answer(wsClient, endpoints_1.endpoints.newPost, {}, interfaces.MessageState.databaseError);
        }
    }));
    ws.on(endpoints_1.endpoints.votePost, (wsClient, message) => __awaiter(this, void 0, void 0, function* () {
        if (!message.isAuth) {
            return ws.answer(wsClient, endpoints_1.endpoints.votePost, {}, interfaces.MessageState.unauthorized);
        }
        let user = null;
        try {
            const results = yield db_query_1.default(con, 'SELECT * FROM users WHERE name = ?', [message.login]);
            if (!results.length) {
                return ws.answer(wsClient, endpoints_1.endpoints.votePost, {}, interfaces.MessageState.unauthorized);
            }
            user = results[0];
        }
        catch (err) {
            return ws.answer(wsClient, endpoints_1.endpoints.votePost, {}, interfaces.MessageState.databaseError);
        }
        try {
            const results = yield db_query_1.default(con, `SELECT * FROM posts_votes WHERE post_id = ? and user_id = ?`, [message.message.post_id, user.id]);
            if (results.length) {
                yield db_query_1.default(con, `UPDATE posts_votes SET is_upvote = ?
            WHERE post_id = ? AND user_id = ?`, [message.message.is_upvote, message.message.post_id, user.id]);
            }
            else {
                yield db_query_1.default(con, `INSERT INTO posts_votes
            (post_id, user_id, is_upvote)
           VALUES (?, ?, ?)`, [message.message.post_id, user.id, message.message.is_upvote]);
            }
            ws.answer(wsClient, endpoints_1.endpoints.votePost, {});
        }
        catch (err) {
            ws.answer(wsClient, endpoints_1.endpoints.votePost, {}, interfaces.MessageState.databaseError);
        }
    }));
}
exports.default = default_1;
