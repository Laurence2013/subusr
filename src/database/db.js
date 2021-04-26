const firebase = require('firebase');
const config = require('../configuration/config');

const db = firebase.initializeApp(config.firebaseConfig);

module.exports = db;
