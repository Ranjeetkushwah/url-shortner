const User = require("../models/user");
const {setUser}=require('../util/auth')
const { v4: uuidv4 } = require("uuid");


async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
  });
  return res.render("/");
}

async function handleUserlogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) return res.render("login", {
      error: "Invalid user name or password",
    });
  const sessionId = uuidv4();
 setUser(sessionId,user)
    res.cookie('uid',sessionId)
  return res.redirect("/");
}

module.exports = {
  handleUserSignup,
  handleUserlogin,
};
