//** This file handles Airtable operations* /

var Airtable = require('airtable');
require('dotenv').config();

var base = new Airtable({ apiKey: process.env.apiKey }).base(process.env.base);
table = base('Line-Students')

/**
 * Update the column in Airtable.
 * @param {string} id - Unique row ID
 * @param {string} field_name - Field name to update
 * @param {*} updatedValue - Value to update
 */
const updateField = async (id, field_name, updateValue) => {

  base('Line-Students').update([
    {
      "id": id,
      "fields": {
        [field_name]: updateValue
      }
    }
  ], function (err, records) {
    if (err) {
      console.error(err);
      return;
    }
  });
}

/**
 * @param {string} id - Unique User ID of the students.
 * @param {string} name - Student name
 */
const createRecord = async (user_id, name) => {

  const students = await table.select({
    filterByFormula: `UserID = '${user_id}'`,
    view: "Grid view"
  }).all();
  var len = students.length;
  console.log(len)
  return new Promise((resolve, reject) => {
    if (len == 0) {

      table.create([
        {
          "fields": {
            "UserID": user_id,
            "Name": name,
            "Course": "WomenWill",
            "Module Completed": 0,
            "Next Module": 1,
            "Day Completed": 0,
            "Next Day": 1
          }
        }
      ], function (err, records) {
        if (err) {
          console.error(err);
          reject(err);
        }
        else {

          resolve("Successfully registered")
        }

      });

    }
    else {
      resolve("Already registered")
    }
  })

}

/**
 * @param {string} id - Unique User ID of the students.
 * @returns - Deleted record ID 
 */
const deleteRecord = async (user_id) => {
  const rec = await table.select({
    filterByFormula: `UserID = '${user_id}'`,
    view: "Grid view"
  }).all();


  rec.forEach(function (record) {
    var id = record.id;
    table.destroy(id, function (err, deletedRecord) {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Deleted record', deletedRecord.id);
    });

  });
}

/**
 * Find total days in a given course.
 * @param {string} number - Unique User ID of the students.
 * @returns total days 
 */
const totalDays = async (number) => {

  var course_tn = await findTable(number)
  const course_table = await base(course_tn).select({

    fields: ["Day"],
    view: "Grid view"
  }).all();
  return new Promise((resolve, reject) => {
    count = 0

    course_table.forEach(function (record) {
      count += 1

    })

    resolve(count)
    reject("Error")
  })
}

/** 
 * Finds the course table of individual students.
 * Note: Course name and Course table name must be same.
 * @param {string} number - Unique User ID of the students.
 * @returns course name 
 */
const findTable = async (number) => {
  const course_table = await base('Line-Students').select({
    filterByFormula: `({UserID} = '${number}')`,
    view: "Grid view"
  }).all();

  return new Promise((resolve, reject) => {
    course_tn = ""
    course_table.forEach(function (record) {
      course_tn = record.get("Course")

      resolve(course_tn)
      reject("error")

    })
  })
}

/**
 * Find the current value in Response column
 * @param {string} id - Unique row id 
 * @returns Response field value for given ID.
 */
const findRecord = async (id) => {
  return new Promise((resolve, reject) => {
    base('Student').find(id, function (err, record) {
      if (err) { console.error(err); return; }

      resolve(record.fields.Response);
    });
  }
  )
}

/**
 * Find the Title and list options for a given module number
 * @param {number} currentDay 
 * @param {number} module_no 
 * @returns List title and options for the particular module number
 */
const findTitle = async (currentDay, module_no) => {

  const records = await base("WomenWill").select({
    filterByFormula: "({Day} =" + currentDay + ")",
    view: "Grid view",

  }).all(
  );
  return new Promise((resolve, reject) => {
    records.forEach(function (record) {
      let title = record.get('Module ' + module_no + ' LTitle');
      let options = record.get('Module ' + module_no + ' List');
      if (title !== undefined) {
        resolve([title, options.split("\n")])
        reject("error")
      }
    })
  })
}

module.exports = {

  findTable,
  totalDays,
  createRecord,
  deleteRecord,
  updateField,
  findRecord,
  findTitle
}
