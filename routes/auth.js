"use strict";

const Router = require("express").Router;
const router = new Router();
const User = require("../models/user")
const { SECRET_KEY } = require("../config")
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError")


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
  const { username } = req.body;
  await User.register(req.body);
  const token = jwt.sign({ username }, SECRET_KEY);
  return res.json({ token });

})


module.exports = router;