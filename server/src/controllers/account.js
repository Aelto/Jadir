const express = require('express');
const consola = require('consola');
const uuidv4 = require('uuid/v4');

const { User, findUserByName, addUser } = require('../db/users.js');
const { hashPassword } = require('../password.js');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const {
    body: { password, name }
  } = req;

  if (!name || !password) {
    return res.status(403).json({
      message: 'name and password required'
    });
  }

  const user = await findUserByName(name)
  if (user !== null) {
    return res.status(409).json({
      message: 'user already exists'
    });
  }

  try {
    const newUser = new User({
      password: hashPassword(password),
      name,
      role: 2
    });

    await addUser(newUser);
  } catch (err) {
    consola.error('error when inserting new user');
    consola.error(err);

    return res.status(500).json({
      message: 'error occured when inserting new user'
    });
  }

  res.status(201).json({
    message: 'created'
  });
});

router.post('/signin', async (req, res) => {
  const { body: { name, password } } = req;

  if (!name || !password) {
    return res.status(403).json({
      message: 'name and password required'
    });
  }

  const hashedPassword = hashPassword(password);
  const user = await findUserByName(name);
  if (user === null || hashedPassword !== user.password) {
    return res.status(403).json({
      message: 'incorrect name or password'
    });
  }

  try {
    await user.setToken(uuidv4());

    return res.json({
      message: 'signed-in',
      token: user.token
    });
  }
  catch(err) {
    return res.status(500).json({
      message: 'error when generating user token'
    });
  }
})

router.get('/', (req, res) => res.json({
  endpoints: [
    'POST /signup',
    'POST /signin'
  ]
}));

module.exports = router;
