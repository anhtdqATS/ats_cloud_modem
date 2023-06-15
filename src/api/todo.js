const express = require("express");
const router = express.Router();
const { create, read, update, remove } = require("../common/crud");
const User = require("../models/users");
const { errorRes } = require("../common/response");

router.post("/post", create(User));
// .get('/all/:page', usersAtPage, read(User))
// .put('/:_id', handlePassword, update(User))
// .delete('/:_id', remove(User))

// .use(notFoun
module.exports = router;
