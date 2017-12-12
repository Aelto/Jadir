"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv4 = require('uuid/v4');
class TokenUserMap {
    constructor() {
        this.map = {};
        this.mapInverse = {};
    }
    addUser(ws) {
        const token = uuidv4();
        this.map[token] = {
            name: null,
            token,
            ws,
            createDate: Date.now(),
            lastActivity: Date.now(),
            state: {
                current: '',
                previous: ''
            }
        };
        // this.mapInverse[name] = token
        return token;
    }
    getUser(token) {
        return this.map[token];
    }
    getToken(name) {
        return this.mapInverse[name];
    }
    getUserByName(name) {
        return this.getUser(this.mapInverse[name]);
    }
    doesUserExist(token) {
        return token in this.map;
    }
    doesUserExistByName(name) {
        return name in this.mapInverse;
    }
    deleteUser(token) {
        const deleted = this.getUser(token);
        console.log(`deleting user [${deleted.name}] from cache`);
        delete this.mapInverse[deleted.name];
        delete this.map[token];
        return deleted;
    }
    deleteUserByName(name) {
        this.deleteUser(this.mapInverse[name]);
    }
    updateActivity(token) {
        this.getUser(token).lastActivity = Date.now();
    }
    removeInactiveUsers(delay = 1000 * 60) {
        const now = Date.now();
        const keys = Object.keys(this.map);
        let i = 0;
        while (i < keys.length) {
            if (now - this.map[keys[i]].lastActivity > delay)
                this.deleteUser(keys[i]);
            i++;
        }
    }
    updateState(user, newState) {
        user.state.previous = user.state.current;
        user.state.current = newState;
    }
    authentifyUser(token, name) {
        if (!this.doesUserExist(token)) {
            throw new Error(`User with token: [${token}] and login: [${name}] does not exist`);
        }
        this.getUser(token).name = name;
        this.mapInverse[name] = token;
    }
    isUserAuth(token, login = '') {
        if (!this.doesUserExist(token))
            return false;
        return this.getUser(token).name === login;
    }
}
exports.default = TokenUserMap;
