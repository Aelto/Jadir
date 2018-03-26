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
    const recursiveBuildCommentsTree = (list, unparsedCommentsIndices, currentComment) => {
        currentComment.children_comments = [];
        const stillUnparsedComments = [];
        for (const index of unparsedCommentsIndices) {
            if (list[index].answers_comment === currentComment.id) {
                currentComment.children_comments.push(list[index]);
            }
            else {
                stillUnparsedComments.push(index);
            }
        }
        for (const subComment of currentComment.children_comments)
            recursiveBuildCommentsTree(list, stillUnparsedComments, subComment);
    };
    ws.on(endpoints_1.endpoints.getPostComments, (wsClient, message) => __awaiter(this, void 0, void 0, function* () {
        const id = message.message.id || 0;
        try {
            const comments = yield db_query_1.default(con, `SELECT c.*, u.name as author FROM comments as c
         LEFT JOIN users as u on c.author_id = u.id
         WHERE c.post_id=? AND c.root_id IS NULL`, [id]);
            for (const comment of comments) {
                if (comment.root_id !== null)
                    continue;
                const subComments = yield db_query_1.default(con, `SELECT c.*, u.name as author FROM comments as c
          LEFT JOIN users as u on c.author_id = u.id
          WHERE c.root_id = ?`, [comment.id]);
                if (subComments.length) {
                    comment.children_comments = subComments;
                    let i = subComments.length;
                    const indicesArray = new Array(i);
                    while (i--)
                        indicesArray[i] = i;
                    recursiveBuildCommentsTree(subComments, indicesArray, comment);
                }
                else
                    comment.children_comments = [];
            }
            ws.answer(wsClient, endpoints_1.endpoints.getPostComments, { comments });
        }
        catch (err) {
            ws.answer(wsClient, endpoints_1.endpoints.getPostComments, {}, interfaces.MessageState.databaseError);
        }
    }));
    ws.on(endpoints_1.endpoints.createPostComment, (wsClient, message) => __awaiter(this, void 0, void 0, function* () {
        if (!message.isAuth) {
            return ws.answer(wsClient, endpoints_1.endpoints.createPostComment, {}, interfaces.MessageState.unauthorized);
        }
        if (!message.message.content.trim().length) {
            return ws.answer(wsClient, endpoints_1.endpoints.createPostComment, {}, interfaces.MessageState.error);
        }
        let user = null;
        try {
            const results = yield db_query_1.default(con, 'SELECT * FROM users WHERE name = ?', [message.login]);
            if (!results.length) {
                return ws.answer(wsClient, endpoints_1.endpoints.createPostComment, {}, interfaces.MessageState.unauthorized);
            }
            user = results[0];
        }
        catch (err) {
            return ws.answer(wsClient, endpoints_1.endpoints.createPostComment, {}, interfaces.MessageState.databaseError);
        }
        try {
            let root_id = null;
            if (message.message.answers_comment !== null) {
                const res = yield db_query_1.default(con, `SELECT root_id FROM comments WHERE id = ?`, [message.message.answers_comment]);
                if (res.length)
                    root_id = res[0].root_id;
            }
            const insertResult = yield db_query_1.default(con, `INSERT INTO comments (answers_comment, author_id, post_id, content, creation_date, root_id)
          VALUES (?, ?, ?, ?, ?, ?)`, [message.message.answers_comment, user.id, message.message.post_id,
                message.message.content, new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace('T', ' '), root_id === null ? message.message.answers_comment : root_id]);
            const results = yield db_query_1.default(con, `SELECT * from comments WHERE id = ?`, [insertResult.insertId]);
            if (results.length) {
                const comment = results[0];
                ws.answer(wsClient, endpoints_1.endpoints.createPostComment, {
                    answers_comment: comment.answers_comment,
                    content: comment.content,
                    creation_date: comment.creation_date,
                    author_id: comment.author_id,
                    id: comment.id,
                    post_id: comment.post_id
                });
            }
            else {
                ws.answer(wsClient, endpoints_1.endpoints.createPostComment, {}, interfaces.MessageState.databaseError);
            }
        }
        catch (error) {
            ws.answer(wsClient, endpoints_1.endpoints.createPostComment, {}, interfaces.MessageState.databaseError);
        }
    }));
}
exports.default = default_1;
