'use strict';

const express = require('express');
const router = express.Router();
const DoctorsController = require('../controllers/DoctorsController');

router.get('/doctors', DoctorsController.getDoctors);
router.get('/web_doctors', DoctorsController.getWebDoctors);
router.post('/create_doctors', DoctorsController.createDoctors);
router.put('/doctors/:id', DoctorsController.updateDoctors)
router.get('/search_doctors', DoctorsController.searchDoctors)
router.delete('/doctors/:id', DoctorsController.deleteDoctors);

module.exports = {
  routes: router
}