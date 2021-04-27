'use-strict'

const DropBox = require('../scrapers/online-storage/dropbox');
const NordLocker = require('../scrapers/online-storage/nordlocker');
const GoogleDrive = require('../scrapers/online-storage/google-drive');

const firebase = require('../database/db');
const firestore = firebase.firestore();

const onlineStorage = async(req, res, next) => {
  try{
    const dropbox = new DropBox();
    const body = dropbox.main();

    /*const nordlocker = new NordLocker();
    const body = nordlocker.main();*/

    /*const googleDrive = new GoogleDrive();
    const body = googleDrive.main();*/

    /*body.then((results) => {
      const result = Object.assign({}, results);
      firestore.collection('online-storage').doc().set(result);
    });*/
  } catch(error) {
    res.status(400).send(error.message);
  }
}

module.exports = {
  onlineStorage
}

