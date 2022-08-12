const express = require('express');
const lineMethods = require('./line')
const airtable = require('./airtable-methods');
const main = require('./main');
require('dotenv').config(".env")

const app = express();

app.use(express.json());


// Route for WhatsApp
app.post('/line', async (req, res) => {
    console.log(req.body.events[0])
    user_id = req.body.events[0].source.userId

    //**Response to message received
    if (req.body.events[0].message != undefined) {
        text_msg = req.body.events[0].message.text
        reply_id = req.body.events[0].replyToken


        if (text_msg == "Start") {
            main.sendModuleContent(String(user_id)).then().catch(e => console.log("Finish start template error " + e))


        }
        else if (text_msg == "Next") {
            main.markModuleComplete(user_id).then().catch(e => console.info("Finish module template error " + e))

        }
        else if (text_msg == ("Finish")) {
            main.markDayComplete(user_id).then().catch(e => console.info("Finish Day template error " + e))
        }
        else {

            main.store_responses(user_id, text_msg).then(console.log(`Message Received ${text_msg} by ${user_id}`)).catch(e => { console.log("Error4 " + e) });
        }
    }

    //**Add and Delete users
    if (req.body.events[0].type === "follow") {
        let userInfo = await lineMethods.getUserInfo(user_id)

        userInfo = JSON.parse(userInfo)
        userName = userInfo.displayName

        console.log("user_id")

        airtable.createRecord(user_id, userName).then(v => console.log(v)).catch(e => console.log(e))

        // TO send this template message on a specific time, implement CRON job.
        lineMethods.sendLineTemplate(userName, user_id)
    }
    else if (req.body.events[0].type === "unfollow") {
        console.log("user_id")
        airtable.deleteRecord(user_id)
    }
})


app.listen(process.env.PORT, () => { console.log('listening on port ' + process.env.PORT); })
