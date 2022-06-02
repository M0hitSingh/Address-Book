const express = require('express');
const multer = require('multer');
const contactController = require('../controllers/contact');
const isAuth = require('../middleware/isAuth');
const router = express.Router();


router.post('/addcontact',isAuth,contactController.addContact);
router.get('/fetchcontact',isAuth,contactController.findContact);
router.get('/getcontact',isAuth,contactController.getContact);
router.get('/search',isAuth,contactController.search);

router.post('/update',isAuth,contactController.update)
router.post('/delete/:id',isAuth,contactController.delete)


const storage = multer.diskStorage({
    destination:(req ,file ,cb)=>{
        cb(null ,'csv')
    },
    filename: (req,file ,cb)=>{
        cb(null ,file.originalname);
    }
});
let upload = multer({storage:storage});

router.post("/bulkupload",isAuth,upload.single('csv'),contactController.bulkContact);





module.exports = router;