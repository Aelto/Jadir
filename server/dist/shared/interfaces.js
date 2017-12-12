"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageState;
(function (MessageState) {
    MessageState[MessageState["success"] = 200] = "success";
    MessageState[MessageState["error"] = 1] = "error";
    MessageState[MessageState["databaseError"] = 500] = "databaseError";
    MessageState[MessageState["notFound"] = 404] = "notFound";
    MessageState[MessageState["unauthorized"] = 401] = "unauthorized";
})(MessageState = exports.MessageState || (exports.MessageState = {}));
var UserRole;
(function (UserRole) {
    UserRole[UserRole["admin"] = 1] = "admin";
    UserRole[UserRole["standard"] = 2] = "standard";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
//#endregion 
