const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const validator = require('validator');

const userSchema = new Schema({
  _id: ObjectId,
  username: { type: String, required: true },
  type: {
    type: String,
    enum: ['member', 'owner', 'admin'],
    required: true,
  },
  password: { type: String, required: true, select: false },
  groups: [{ type: ObjectId, ref: 'Group' }], // connect to  groups

  updated_at: Date,
});

module.exports = mongoose.model('User', userSchema, 'users');
