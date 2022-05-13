const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

module.exports.createUser = async function () {
  try {
    mongoose.connect('mongodb://mongodb:27017/agowork');

    const modelUser = mongoose.model('user', new mongoose.Schema({
      firstname: String,
      lastname: String,
      email: {
        type: String,
        unique: true,
      },
      town: String,
      picture: String,
      role: String,
      password: String,
      mood: mongoose.Types.ObjectId,
      campus: mongoose.Types.ObjectId,
    }));

    const password = 'Password123';
    const hashedPassword = await bcrypt.hashSync(password, 12);
    const pictures = ['https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
      'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
      'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1015&q=80',
      'https://images.unsplash.com/photo-1509305717900-84f40e786d82?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1068&q=80',
      'https://images.unsplash.com/photo-1520423465871-0866049020b7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
    ];
    const cities = ['Paris', 'Londres', 'Madrid', 'Moscou', 'New York', 'Long Beach', 'Los Angeles', 'Marseille', 'Nice', 'Grenoble', 'Brest'];
    const campus = ['626f94b1b1e0a9dbe7f2ab47', '62730a16131ebab66dc52676', '627309f7131ebab66dc52672'];
    const mood = ['627029b2c97b9ac628acddff', '6270106bc6cc0d4054d1f94c', '626f949fe6787fad26d7d484', '62701076c6cc0d4054d1f953'];

    if (modelUser.count() !== 0) {
      await modelUser.deleteMany();
      console.log('fixtures: users delete()');
    }

    for (let i = 0; i < 55; i++) {
      let firstname;
      let lastname;
      let email;
      let role;
      firstname = `Firstname${[i]}`;
      lastname = `Lastname${[i]}`;
      email = `email${[i]}@gmail.com`;
      const citiesRandom = Math.floor(Math.random() * cities.length);
      const picturesRandom = Math.floor(Math.random() * pictures.length);
      const campusRandom = Math.floor(Math.random() * campus.length);
      const moodRandom = Math.floor(Math.random() * mood.length);

      if (i >= 0 && i < 5) {
        role = 'ADMIN';
      } else if (i >= 5 && i < 10) {
        role = 'TEACHER';
      } else if (i >= 10 && i < 55) {
        role = 'STUDENT';
      }

      const body = {
        firstname,
        lastname,
        town: cities[citiesRandom],
        campus: mongoose.Types.ObjectId(campus[campusRandom]),
        email,
        picture: pictures[picturesRandom],
        role,
        mood: mongoose.Types.ObjectId(mood[moodRandom]),
        password: hashedPassword,
      };
      const user = new modelUser(body);
      await user.save();
    }
    console.log('fixtures: users saved()');
  } catch (err) {
    console.log(err);
  }
};
