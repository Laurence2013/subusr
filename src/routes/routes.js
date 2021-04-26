const express = require('express');
const { onlineStorage } = require('../controllers/storageController');

const router = express.Router();

router.post('/online-storage', onlineStorage);

//router.get('/storage', addDropBox);

module.exports = {
  routes: router
}
