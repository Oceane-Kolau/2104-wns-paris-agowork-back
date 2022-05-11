const mongoose = require('mongoose');
require('dotenv').config();
ObjectId = require('mongodb').ObjectID;

module.exports.createCampus = async function () {
  try {
    mongoose.connect('mongodb://mongodb:27017/agowork');

    const modelCampus = mongoose.model('campus', new mongoose.Schema({
      address: String,
      name: String,
      phone: String,
    }));

    if (modelCampus.count() !== 0) {
      await modelCampus.deleteMany();
      console.log('fixtures: campus delete()');
    }
    const body = {
      name: 'Paris',
      address: '120 rue de la météo',
      phone: '0123636559',
    };

    const campus = new modelCampus(body);
    await campus.save();

    console.log('fixtures: campus saved()');
  } catch (err) {
    console.log(err);
  }
};
