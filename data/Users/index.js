'use strict';
const config = require('../../config');
const sql = require('mssql');
let bcrypt = require("bcryptjs");
const connError = new Error('Connection Error');
const queryError = new Error('Query Error');

const getUsers = async () => {
  try {
    let pool = await sql.connect(config.sql);
    let request = new sql.Request(pool);
    try {
      const getUsers = await request.query`SELECT * FROM UERMMMC..WEB_DOCTORS_USERS`;
      return getUsers.recordset
    } catch (error) {
      return queryError.message
    }
  } catch (error) {
    return connError.message
  }
}

const searchSystemUsers = async (searchData, res) => {
  let filterData = searchData
  let filter = `%${filterData}%`;
  let pool = await sql.connect(config.sql);
  let request = new sql.Request(pool);

  try {
    const users = await request.query`SELECT *
    FROM UERMMMC..WEB_DOCTORS_USERS
    WHERE FIRSTNAME LIKE ${filter} OR 
    LASTNAME LIKE ${filter} OR 
    POSITION LIKE ${filter}`;
    
    return users.recordset;
  } catch (error) {
    return error
  }
}

const createUser = async (userRequest) => {
  try {
    let user_code = Math.floor(100000 + Math.random() * 900000);
    user_code = `${user_code}`;
    let firstname = `${userRequest.firstname}`;
    let lastname = `${userRequest.lastname}`;
    let email = `${userRequest.email}`;
    let position = `${userRequest.position}`;
    let username = `${userRequest.username}`;
    let password = `${userRequest.password}`;
    password = bcrypt.hashSync(password, 8);
    await sql.connect(config.sql);
    let transaction = new sql.Transaction()
    try {
      await transaction.begin();
      console.log('email: ', email);
      const checkDuplicateUsername = await new sql.Request(transaction)
        .query`SELECT COUNT(USERNAME) FROM 
        UERMMMC..WEB_DOCTORS_USERS 
        WHERE USERNAME = ${username}`;
      console.log('checkEmail: ', Object.values(checkDuplicateUsername.recordset[0]));
      if (Object.values(checkDuplicateUsername.recordset[0]) < 1) {
        const createUser = await new sql.Request(transaction).query`INSERT INTO UERMMMC..WEB_DOCTORS_USERS 
        (
        USER_CODE,
        FIRSTNAME,  
        LASTNAME, 
        POSITION,
        EMAIL, 
        USERNAME, 
        USER_PASSWORD) 
        VALUES 
        (
        ${user_code},
        ${firstname},
        ${lastname},
        ${position},
        ${email},
        ${username},
        ${password}
        )`;
        await transaction.commit();
        return "Registration successful"
      } else {
        return "Username already in used"
      }

    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
    return error
  }
}

const editProfile = async (userRequest) => {
  try {
    let firstname = `${userRequest.firstname}`;
    let lastname = `${userRequest.lastname}`;
    let email = `${userRequest.email}`;
    let id = `${userRequest.id}`;

    await sql.connect(config.sql);
    let transaction = new sql.Transaction()
   
    try {
      await transaction.begin();
      const editUser = await new sql.Request(transaction).query`UPDATE UERMMMC..WEB_DOCTORS_USERS
      SET 
      FIRSTNAME = ${firstname},
      LASTNAME = ${lastname},
      EMAIL = ${email}
      WHERE ID = ${id}`;

      await transaction.commit();
      return "Update successful"

    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  } catch (error) {
    console.log(error.message);
    return error
  }
}
const getProfile = async (reqQuery) => {
  try {
    let pool = await sql.connect(config.sql);
    let request = new sql.Request(pool);
    try {
      let getUsers = await request.query`SELECT * FROM QRecords..Active_Users WHERE id = ${reqQuery.id}`;
      return getUsers.recordset;
    } catch (error) {
      return error.message
    }
  } catch (error) {
    console.log(error.message)
  }
}

const logIn = async (reqBody) => {
  try {
    let pool = await sql.connect(config.sql);
    let request = new sql.Request(pool);
    try {
      let getUsers = await request.query`SELECT * FROM QRecords..Active_Users WHERE username = ${reqBody.username}`;
      if (!getUsers.recordset[0]) {
        return "Invalid Username";
      } else {
        let passwordIsValid = bcrypt.compareSync(reqBody.password, getUsers.recordset[0].USER_PASSWORD)
        if (!passwordIsValid) {
          return 'Invalid Password';
        }
        return getUsers.recordset[0];
      }

    } catch (error) {
      return error.message
    }
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  getUsers,
  searchSystemUsers,
  createUser,
  editProfile,
  getProfile,
  logIn
}
