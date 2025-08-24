const express = require('express')
const router = express.Router();


const { loginAdmin, addAdmin }  = require('../controllers/adminController');
const { auth }  = require('../middleware/auth');
const { createPlant, getPlants } = require('../controllers/plantController');

// Admin routes
router.post('/admin', loginAdmin);
router.post('/admin/me', addAdmin);


// add plant
router.post('/plant', auth, createPlant);
router.get('/plants', getPlants);

module.exports = router;