const { login } = require('./login');
const { register } = require('./register');
const { getAll } = require('./get-all');

const ControllerAuth = {
  login,
  register,
  getAll,
};

module.exports = ControllerAuth;
