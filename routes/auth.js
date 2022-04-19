"use strict";

const Router = require("express").Router;
const router = new Router();
const User = require("../models/user")
const { SECRET_KEY } = require("../config.js")
const jwt = require("jsonwebtoken");


/** POST /login: {username, password} => {token} */

router.post("/login", async function (req, res, next){
  const { username, password } = req.body;
  const authValue = await User.authenticate(username,password);
  if (authValue) {
      const token = jwt.sign({ username }, SECRET_KEY);
      return res.json({ token });
  }
  throw new UnauthorizedError("Invalid user/password");
})


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post("/register",async function (req, res, next){
  const {username, password, first_name, last_name, phone} = req.body;
  const user = User.register({username, password, first_name, last_name, phone});
  const token = jwt.sign({ username }, SECRET_KEY);
  return res.json({ token });

})


module.exports = router;