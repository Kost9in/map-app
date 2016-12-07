const mongoose = require('mongoose');String

const linkSchema = new mongoose.Schema({
  links: [{type: mongoose.Schema.Types.ObjectId, ref: 'point'}]
});

module.exports = mongoose.model('link', linkSchema);
