const Admin = require('../../models/admin');
const bcrypt = require('bcrypt');

register = async (req, res) => {
  try {
    const { nik, password } = req.body;
    const user = await Admin.findOne({ nik });
    if (user) {
      return res.status(400).json({ message: 'User admin already exists' });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new Admin({ nik, password: passwordHash });
    savedUser = await newUser.save();
    res.status(201).json({ data: savedUser, message: 'User admin created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register };
