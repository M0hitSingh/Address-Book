const express = require('express');
const multer = require('multer');
const contactController = require('../controllers/contact');
const isAuth = require('../middleware/isAuth');
const router = express.Router();

// Add a new contact.
router.post('/addcontact',isAuth,contactController.addContact);
//Add bulk contacts.
router.post("/bulkupload",isAuth,upload.single('csv'),contactController.bulkContact);
// Fetch details of single contact
router.get('/fetchcontact',isAuth,contactController.findContact);
// Fetch phase matching 
router.get('/search',isAuth,contactController.search);
//Fetch the list of contacts with pagination
router.get('/getcontact',isAuth,contactController.getContact);
//Update the contact.
router.post('/update',isAuth,contactController.update)
//Delete the given contact
router.post('/delete/:id',isAuth,contactController.delete)



// multer API for uploading CSV files
const storage = multer.diskStorage({
    destination:(req ,file ,cb)=>{
        cb(null ,'csv')
    },
    filename: (req,file ,cb)=>{
        cb(null ,file.originalname);
    }
});
let upload = multer({storage:storage});


module.exports = router;