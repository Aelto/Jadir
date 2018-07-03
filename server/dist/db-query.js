"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(con, req, variables) {
    return new Promise((resolve, reject) => {
        con.query(req, variables, (err, results, fields) => {
            if (err) {
                throw err;
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.default = default_1;
