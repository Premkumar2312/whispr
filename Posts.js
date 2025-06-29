const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 200 },
  reactions: {
    fire: { type: Number, default: 0 },
    skull: { type: Number, default: 0 },
    bulb: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
