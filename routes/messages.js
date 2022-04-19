"use strict";

const Router = require("express").Router;
const router = new Router();
const Message = require("../models/message");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const { UnauthorizedError } = require("../expressError");


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Makes sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get("/:id", ensureLoggedIn, async function (req, res) {
  const message = await Message.get(req.params.id);

  const loggedInUsername = res.locals.user.username;
  if (loggedInUsername === message.from_user.username ||
    loggedInUsername === message.to_user.username) {
    return res.json({ message });
  }

  throw new UnauthorizedError("Logged-in user must be the to or from user to view message.");

});


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensureLoggedIn, async function (req, res) {
  const loggedInUsername = res.locals.user.username;
  const message = await Message.create({from_username: loggedInUsername,
                                        to_username : req.body.to_username,
                                        body: req.body.body });

  return res.json({message});

});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/

router.post("/:id/read", ensureLoggedIn, async function (req,res){
  const fullMessage = await Message.get(req.params.id);

  const loggedInUsername = res.locals.user.username;
  if (loggedInUsername === fullMessage.to_user.username ){
    const message = await Message.markRead(req.params.id)
    return res.json({ message })
  }

  throw new UnauthorizedError("Logged-in user must be the intended recipient.");

})

module.exports = router;


