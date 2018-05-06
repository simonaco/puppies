const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const puppySchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: String,
    saying: String
  },
  {
    collection: 'puppies',
    read: 'nearest'
  }
);

const Puppy = mongoose.model('Puppy', puppySchema);

module.exports = Puppy;
