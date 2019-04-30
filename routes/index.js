const express = require('express');
const router  = express.Router();

const processController =  require('../controllers/process');


router.get('/:url', processController.process);

module.exports = router;
