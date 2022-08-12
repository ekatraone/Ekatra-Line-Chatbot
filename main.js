//* This file handles the following tasks:
//* 1. Updating day and module values of individual students in Airtable.
//* 2. Fetching and sending the course content based on each student's enrolled course and progress.

var Airtable = require('airtable');
require('dotenv').config();
const airtable = require('./airtable-methods');
const attachment = require('./attachments');
const line = require('./line');


var base = new Airtable({ apiKey: process.env.apiKey }).base(process.env.base);

/** This function handles storing list option selected by the student in Airtable field named Responses
 * Called when the student selects the option from the list message.
 * @param {string} number - Unique User ID of the student
 * @param {string} value  - Option selected from the list
 */
async function store_responses(number, value) {

    const records = await base("Line-Students").select({
        filterByFormula: `({UserID} = '${number}')`,
        view: "Grid view",

    }).all(
    ); records.forEach(async function (record) {

        let id = record.id
        let currentModule = record.get("Next Module")
        let currentDay = record.get("Next Day")

        let list = await airtable.findTitle(currentDay, currentModule).then().catch(e => console.error(e))

        let existingValues = await airtable.findRecord(id)
        let title = list[0]
        let options = list.filter((v, i) => i !== 0)

        /**
        * Check to see whether the text message matches one of the choices in the List message for a certain module. 
        * If yes, then store the title and option in Airtable field name Response.
        * */

        for (i = 0; i < options[0].length; i++) {

            if (options[0][i] == value) {
                if (existingValues == undefined) {

                    existingValues = ""
                    newValues = title + "\n" + value

                }
                else {
                    newValues = existingValues + "\n\n" + title + value
                }

                if (existingValues.includes(title)) {
                    console.log("Feedback already recorded")
                    await findContent(currentDay, currentModule, number)
                }
                else {
                    airtable.updateField(id, "Response", newValues).then(async () => {

                        await findContent(currentDay, currentModule, number)

                    }).catch(error => console.error("Error storing response ", error))
                }
            }
        }
    })
}

/** Executed after updating the Airtable Response field and continues the flow.
 * @param {number} currentDay 
 * @param {number} module_No - current module number
 * @param {string} number - Unique User ID of the student
 */
async function findContent(currentDay, module_No, number) {
    var course_tn = await airtable.findTable(number)
    const records = await base(course_tn).select({
        filterByFormula: `({Day} = ${currentDay})`,
        view: "Grid view",

    }).all(
    );
    records.forEach(function (record) {
        var data = ""
        var module_link = record.get("Module " + module_No + " Link")


        if (!!module_link) {

            setTimeout(() => {
                data = module_link

                line.sendText(number, data)
            }, 5000)
        }


        const hTxt = `Let's move forward!`
        const bTxt = `Click below`
        const btnTxt = "Next"

        setTimeout(() => {

            line.sendInteractiveMsg(number, hTxt + "\n" + bTxt, btnTxt).then().catch((e) => console.log(e))

        }, 7000)

    })
}

/**
 * Send List Interactive Message to the students
 * @param {number} currentDay 
 * @param {number} module_No - current module number
 * @param {string} number - Unique User ID of the student
 */
async function sendList(currentDay, module_No, number) {
    var course_tn = await airtable.findTable(number)
    const records = await base(course_tn).select({
        filterByFormula: `({Day} = '${currentDay}')`,
        view: "Grid view",

    }).all(
    );
    records.forEach(function (record) {
        let module_title = record.get("Module " + module_No + " LTitle")
        let module_list = record.get("Module " + module_No + " List")

        console.log("Executing List")
        //Each line in the Module LTitle is separated by \n and considered as a new option for the list

        options = module_list.split("\n").filter(n => n)

        let d = []
        // Convert the array of options into a JSONArray
        /**Sample Output:
            [
                {
                type: 'action',
                action: {
                type: 'message',
                label: 'option 1',
                text: 'option 1'
                }
            },
            {
            type: 'action',
            action: {
            type: 'message',
            label: 'Option 2',
            text: 'Option2 '
            }
            },
        ]
                */
        for (const row of options) {
            data.push({
                "type": "action",
                "action": {
                    "type": "message",
                    "label": row,
                    "text": row
                }

            })

        }
        console.log(data)
        console.log("Delay of sendMediaFile ")


        attachment.sendMediaFile(currentDay, module_No, number).then(console.log(`3. Media file sent to ${number}`)).catch(e => console.log("Error 3 " + e))

        setTimeout(() => {
            line.sendListMessage(number, module_title, data).then().catch(e => console.log("Error " + e));
        }, 5000)
    })
}

/** This functions continues the flow based on student's progress  
 * @param {string} number - Unique User ID of the student
 */
async function sendModuleContent(number) {
    const records_Student = await base('Line-Students').select({
        filterByFormula: `({UserID} = '${number}')`,
        view: "Grid view",

    }).all();
    records_Student.forEach(function (record) {

        var cDay = record.get("Next Day")
        var next_module = record.get("Next Module") // 0

        // If Next Module field value is 0, this indicates all the modules for the day are delivered and the day is completed
        if (next_module == 0) {

            sendEndDayMessage(cDay, number).then().catch(e => { console.log("Error in executing sendEndDayMessage " + e) })

        }
        else {

            findModule(cDay, next_module, number).then().catch(e => { console.log("Error in executing findModule " + e) })
        }

    })

}

/** This function finds the current module of the respective students and sends the content accordingly. 
 * Executed only if module text or module list is not empty 
 * @param {number} currentDay 
 * @param {number} module_No - current module number
 * @param {number} number - Unique User ID of the student
 */
async function findModule(currentDay, module_No, number) {
    var course_tn = await airtable.findTable(number).then().catch(e => console.log("Error number" + e))
    const records = await base(course_tn).select({

        filterByFormula: `({Day} = ${currentDay})`,
        view: "Grid view",

    }).all(
    );

    records.forEach(async function (record) {
        var day = record.get("Day")

        var module_text = record.get("Module " + module_No + " Text")
        let module_title = record.get("Module " + module_No + " LTitle")
        var module_link = record.get("Module " + module_No + " Link")

        console.log("Executing FindModule")

        // If list title is not empty and module text is empty then execute sendList function
        if (!!module_title && !module_text) {
            console.log("!!module_title && !module_text " + !!module_title && !module_text)
            await sendList(currentDay, module_No, number)
        }

        /**
        * If list title is  empty and module text is not empty, then execute sendList function
        * Otherwise, Skip the module and call markModuleComplete function  
        */
        else if (!!module_text && !module_title) {

            var data = ""

            //If the module contains a link then send the link otherwise only send the media file
            if (!!module_link) {
                console.log("Module link not empty ")
                data = module_text
                line.sendText(number, data)

                setTimeout(() => {
                    attachment.sendMediaFile(day, module_No, number).then(console.log(`1. Media file sent to ${number}`)).catch(e => console.log("Error" + e))

                }, 3000)

                setTimeout(() => {
                    console.log("Delay of link ")

                    line.sendText(number, module_link)

                }, 7000)

            }
            else {
                data = module_text
                console.log("Module link null ")

                line.sendText(number, data)

                setTimeout(() => {
                    console.log("Delay of sendMediaFile 2")

                    attachment.sendMediaFile(day, module_No, number).then(console.log(`2. Media file sent to ${number}`)).catch(e => console.log("Error" + e))
                }, 7000)

            }

            const hTxt = `Let's move forward!`
            const bTxt = `Click below`
            const btnTxt = "Next"


            setTimeout(() => {
                console.log("Delay of Next Interactive Button")
                line.sendInteractiveMsg(number, hTxt + "\n" + bTxt, btnTxt).then().catch((e) => console.log(e))

            }, 15000)
        }
        else if (!!module_text && !!module_title) {
            data = module_text

            await sendList(currentDay, module_No, number)
        }
        else {
            markModuleComplete(number)
        }
    });
}

/**
 * Check if the next module is greater than 10
 * If yes, then update columns Next Module to 0 and Module Completed to the current module number.
 * Otherwise, update Next Module by 1 and Module Completed to the Next Module.
 * Also executed when Next keyword is received
 * @param {string} number - Unique User ID of the students
 */

async function markModuleComplete(number) {
    const records_Student = await base('Line-Students').select({
        filterByFormula: `({UserID} = '${number}')`,
        view: "Grid view",

    }).all();
    records_Student.forEach(function (record) {
        var id = record.id
        var current_module = Number(record.get("Next Module")) //1 
        var cDay = Number(record.get("Next Day"))

        var next_module = current_module + 1

        if (next_module > 10) {

            airtable.updateField(id, "Module Completed", current_module)

            airtable.updateField(id, "Next Module", 0)

            sendEndDayMessage(cDay, number);

        }
        else {

            airtable.updateField(id, "Next Module", next_module)

            airtable.updateField(id, "Module Completed", current_module)
            findModule(cDay, next_module, number)
        }


    });
}

/**Update Day Completed field and Next Day field in Student's table of the student
 * Called when received Finish day keyword
 * @param {string} number - Unique User ID of the students.
 */

async function markDayComplete(number) {
    const records_Student = await base('Line-Students').select({
        filterByFormula: `({UserID} = '${number}')`,
        view: "Grid view",

    }).all();
    total_days = 0
    var total_days = await airtable.totalDays(number)

    records_Student.forEach(function (record) {
        var id = record.id
        var comp_day = Number(record.get("Next Day"))


        console.log("Entered markDay")
        var nextDay = comp_day + 1
        if (comp_day <= total_days) {

            try {
                airtable.updateField(id, "Next Day", nextDay)

                airtable.updateField(id, "Day Completed", comp_day)

                console.log("Complete Day " + comp_day)

                //Reset module numbers
                const next_mod = 1
                const module_completed = 0
                airtable.updateField(id, "Next Module", next_mod)

                airtable.updateField(id, "Module Completed", module_completed)
            }
            catch (e) {
                console.log("Error while updating complete day " + e)
            }
        }


    });
}


/** Send end day interactive message to the students. 
 * 
 * @param {*} currentDay 
 * @param {*} number - Unique User ID of the students.
 */
async function sendEndDayMessage(currentDay, number) {
    var course_tn = await airtable.findTable(number)
    const records = await base(course_tn).select({
        filterByFormula: `({Day} = ${currentDay})`,
        view: "Grid view",

    }).all(
    );
    records.forEach(function (record) {
        console.log("Entered sendEndDayMessage module")
        var day = record.get("Day")

        const hTxt = "I hope that was helpful\n"
        const bTxt = "I'll be back with more updates tomorrow!. \n\n_powered by ekatra_"
        const btnTxt = "Finish Day " + day


        setTimeout(() => {

            line.sendInteractiveMsg(number, hTxt + bTxt, btnTxt)

        }, 1000)



    })
}

module.exports = { markDayComplete, sendModuleContent, markModuleComplete, store_responses, sendList }

