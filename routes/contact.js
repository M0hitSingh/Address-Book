const express = require('express');

const contactController = require('../controllers/contact');
const isAuth = require('../middleware/isAuth');
const router = express.Router();


router.post('/addcontact',isAuth,contactController.addContact);
router.get('/fetchcontact',isAuth,contactController.findContact);
router.get('/getcontact',isAuth,contactController.getContact);
router.get('/search',isAuth,contactController.search);

router.post('/update',isAuth,contactController.update)
router.post('/delete/:id',isAuth,contactController.delete)










module.exports = router;