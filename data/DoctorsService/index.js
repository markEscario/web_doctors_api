'use strict';
const config = require('../../config');
const sql = require('mssql');
let bcrypt = require("bcryptjs");
const connError = new Error('Connection Error');
const queryError = new Error('Query Error');

const getDoctors = async () => {
  try {
    let pool = await sql.connect(config.sql);
    let request = new sql.Request(pool);
    try {
      const doctorsList = await request.query`SELECT * FROM UERMMMC..DOCTORS AS Dr LEFT JOIN UERMMMC..WEB_DOCTORS AS WDr ON Dr.CODE = WDr.code
      INNER JOIN UERMMMC..DEPARTMENT AS Dep ON Dep.DEPARTMENT = Dr.[AREA OF SPECIALTY] WHERE WDr.status = 'ACTIVE'`;
      return doctorsList.recordset
    } catch (error) {
      return queryError.message
    }
  } catch (error) {
    return connError.message
  }
}

const getWebDoctors = async () => {
  try {
    let pool = await sql.connect(config.sql);
    let request = new sql.Request(pool);
    try {
      const webDoctorsList = await request.query`SELECT * FROM UERMMMC..DOCTORS AS Dr LEFT JOIN UERMMMC..WEB_DOCTORS AS WDr ON Dr.CODE = WDr.code
      INNER JOIN UERMMMC..DEPARTMENT AS Dep ON Dep.DEPARTMENT = Dr.[AREA OF SPECIALTY] WHERE WDr.status = 'ACTIVE'`;
      return webDoctorsList.recordset
    } catch (error) {
      return queryError.message
    }
  } catch (error) {
    return connError.message
  }
}

const createDoctors = async (reqData) => {
  try {
    let code = `${reqData.code}`;
    let last_name = `${reqData.last_name}`;
    let dr_name = `${reqData.last_name} ${reqData.first_name}`;
    let first_name = `${reqData.first_name}`;
    let category = `${reqData.category}`;
    let room = `${reqData.room}`;
    let alias = `${reqData.alias}`;
    let specialty = `${reqData.specialty}`;
    let clinical_department = `${reqData.clinical_department}`;
    let hmo = `${reqData.hmo}`;
    let hmo_short = `${reqData.hmo_short}`;
    let contact_local = `${reqData.contact_local}`;
    let contact_direct = `${reqData.contact_direct}`;
    let schedule = `${reqData.schedule}`;
    let status = `${reqData.status}`;

    await sql.connect(config.sql);
    let transaction = new sql.Transaction()
    try {
      await transaction.begin();
      const addWebDoctor = await new sql.Request(transaction).query`INSERT INTO UERMMMC..WEB_DOCTORS 
        (
        code,
        lastName,
        firstName,  
        category, 
        room, 
        alias,
        specialty,
        hmo,
        hmoShort,
        contactLocal,
        contactDirect,
        schedule,
        status
        ) 
        VALUES 
        (
        ${code},
        ${last_name},
        ${first_name},
        ${category},
        ${room},
        ${alias},
        ${specialty},
        ${hmo},
        ${hmo_short},
        ${contact_local},
        ${contact_direct},
        ${schedule},
        ${status}
        )`;
      if (addWebDoctor) {
        const doctor = await new sql.Request(transaction).query`INSERT INTO UERMMMC..DOCTORS 
  (
  CODE,
  NAME,
  clinicalDepartment
  ) 
  VALUES 
  (
  ${code},
  ${dr_name},
  ${clinical_department}
  )`;
      }

      await transaction.commit();
      return "Doctor has been created"

    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
    return error
  }
}
const updateDoctors = async (dRequest, dCode) => {
  try {
    let code = `${dCode}`;
    let last_name = `${dRequest.last_name}`;
    let first_name = `${dRequest.first_name}`;
    let dr_name = `${dRequest.last_name} ${dRequest.first_name}`;
    let category = `${dRequest.category}`;
    let room = `${dRequest.room}`;
    let alias = `${dRequest.alias}`;
    let specialty = `${dRequest.specialty}`;
    let clinical_department = `${dRequest.clinical_department}`;
    let hmo = `${dRequest.hmo}`;
    let hmo_short = `${dRequest.hmo_short}`;
    let contact_local = `${dRequest.contact_local}`;
    let contact_direct = `${dRequest.contact_direct}`;
    let schedule = `${dRequest.schedule}`;
    let status = `${dRequest.status}`;

    await sql.connect(config.sql);
    let transaction = new sql.Transaction()

    try {
      await transaction.begin();
      const updateWebDoctor = await new sql.Request(transaction).query`UPDATE UERMMMC..WEB_DOCTORS
      SET 
      code = ${code},
      lastName = ${last_name},
      firstName = ${first_name},
      category = ${category},
      room = ${room}, 
      alias = ${alias},
      specialty = ${specialty},
      hmo = ${hmo},
      hmoShort = ${hmo_short},
      contactLocal = ${contact_local},
      contactDirect = ${contact_direct},
      schedule = ${schedule},
      status = ${status}
      WHERE code = ${code}`;
      
      if (updateWebDoctor) {
        const updateDoctor = await new sql.Request(transaction).query`UPDATE UERMMMC..DOCTORS
        SET 
        name = ${dr_name},
        clinicalDepartment = ${clinical_department}
        WHERE CODE = ${code}`;
      }
      await transaction.commit();
      return "Doctor has been updated"

    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
    return error
  }
}

const deleteDoctors = async (dCode) => {
  try {
    let code = `${dCode}`;
    await sql.connect(config.sql);
    let transaction = new sql.Transaction()
    try {
      await transaction.begin();
      const deleteWebDoctor = await new sql.Request(transaction).query`DELETE FROM UERMMMC..WEB_DOCTORS WHERE code = ${code}`;
      await transaction.commit();
      return "Doctor was deleted"

    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
    return error
  }
}

module.exports = {
  getDoctors,
  createDoctors,
  getWebDoctors,
  updateDoctors,
  deleteDoctors
}
