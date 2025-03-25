const userDb = require("../models/user.js");
const crypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    console.log(name, password, email);
    console.log(name,password,email)
    const user = await userDb.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ error: "user already exist" });
    }
    const hashedpassword = await crypt.hash(password, 10);
    const newUser = await userDb.create({
      name,
      email,
      password: hashedpassword,
    });
    console.log("created new record successfully");
    return res.status(201).json({ success: "user registered successfully" });
  } catch (err) {
    console.log("error occured while registering");
    return res.status(500).json({ error: err.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password)
    if (!email || !password)
      return res.status(401).json({ error: "invalid credentials" });
    const user = await userDb.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "invalid credentials" });
    const isMatch = await crypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN, {
      expiresIn: "1hr",
    });
    res.status(200).json({ message: "login successfull", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { register, login };
