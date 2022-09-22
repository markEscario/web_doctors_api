'use strict';
const doctorsService = require('../data/DoctorsService');
const config = require("../Token/auth.config");

const getDoctors = async (req, res) => {
  try {
    const doctors = await doctorsService.getDoctors();
    res.send(doctors);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const getWebDoctors = async (req, res) => {
  try {
    const webDoctors = await doctorsService.getWebDoctors();
    res.send(webDoctors);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const searchDoctors = async (req, res) => {
  try {
    let filterData = req.query.filter_params

    const results = await doctorsService.searchDoctors(filterData);
    res.send(results);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const createDoctors = async (req, res) => {
  try {
    let reqData = req.body;

    const doctors = await doctorsService.createDoctors(reqData);
    res.send(doctors);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const updateDoctors = async (req, res) => {
  try {
    let dCode = req.params.id;
    let dRequest = req.body;

    const doctors = await doctorsService.updateDoctors(dRequest, dCode);
    res.send(doctors);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const deleteDoctors = async (req, res) => {
  try {
    let dCode = req.params.id;

    const deleteDr = await doctorsService.deleteDoctors(dCode);
    res.send(deleteDr);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports = {
  getDoctors,
  getWebDoctors,
  searchDoctors,
  createDoctors,
  updateDoctors,
  deleteDoctors
}