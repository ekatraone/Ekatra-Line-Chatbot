//** This file handles fetching attachments from Airtable and sending media content  to Line*/

const airtable = require('./airtable-methods')
var Airtable = require('airtable');
require('dotenv').config("./env")
var path = require('path')
const line = require('./line');

var base = new Airtable({ apiKey: process.env.apiKey }).base(process.env.base);

/**
 * Check if the module contains any files
 * If yes, then fetch the file name and file URL from Airtable, and send the file based on its type.
 * @param {number} cDay - Current Day
 * @param {number} cModule - Current Module
 * @param {string} number - Unique User ID of the students.
 */
async function sendMediaFile(cDay, cModule, number) {

    var course_tn = await airtable.findTable(number).then(`Table name of ${number} is ${course_tn}`).catch(e => console.log(e))
    const records = await base(course_tn).select({
        filterByFormula: "({Day} =" + cDay + ")",
        view: "Grid view",

    }).all();

    records.forEach(async function (record) {
        img = record.get("Module " + cModule + " File")

        if (img != undefined) {
            len = img.length
            for (i = 0; i < len; i++) {
                filename = img[i].filename

                // Get File extension
                file_ext = path.extname(filename)
                imgurl = img[i].url

                if (file_ext == ".mp4") {
                    line.sendMedia(number, imgurl, "video")
                        .then(console.log("Sent media"))
                        .catch(e => console.log("Error sending video media " + e))

                }
                else if (file_ext == ".png" || file_ext == ".jpg") {
                    line.sendMedia(number, imgurl, "image").then().catch(e => console.log("Error sending image media " + e))
                }

                else if (file_ext == ".txt" || file_ext == ".pdf" || file_ext == ".xlsx") {
                    line.sendDocuments(number, filename, imgurl).then(console.log("Sent media")).catch(e => console.log("Error sending document " + e))
                }
            }
        }
    });
}

module.exports = { sendMediaFile }


