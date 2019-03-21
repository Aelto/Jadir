const dbQuery = require('./db-query.js');

class User {
  constructor({ id, name, password, role, token, image_url }) {
    if (!name || !password || !role) {
      throw new Error('missing required values from user [name, password, role]');
    }

    this.id = id;
    this.name = name;
    this.password = password;
    this.role = role;
    this.token = token;
    this.image_url = image_url;
  }

  async setToken(newToken) {
    await setUserToken(this.name, newToken);
    this.token = newToken;
  }
};

exports.User = User;

/**
 * @param name {string}
 * @returns {User | null}
 */
exports.findUserByName = async function(name) {
  const users = await dbQuery(`select * from users where name = ?`, [name]);

  if (!users.length) {
    return null;
  }
  else {
    return new User(users[0]);
  }
}

exports.addUser = async function(user) {
  if (!(user instanceof User)) {
    throw new Error('can only insert into users table instances of class User');
  }

  return await dbQuery(`insert into users (name, password, role) values (?, ?, ?)`, [
    user.name,
    user.password,
    user.role
  ]);
}


function setUserToken(username, token) {
  return dbQuery(`update users set token = ? where name = ?`, [token, username]);
}
exports.setUserToken = setUserToken;