//** This file contains LINE API functions */

var request = require('request');
require('dotenv').config("./env")

/**
 * 
 * @param {number} user_id : Unique User ID of the students.
 * @param {*} hTxt : Header Text
 * @param {*} btnTxt : Button Text
 */
const sendInteractiveMsg = async (user_id, hTxt, btnTxt) => {
    var options = {
        'method': 'POST',
        'url': 'https://api.line.me/v2/bot/message/push',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': process.env.channel_access_token,
        },
        body: JSON.stringify({
            "to": user_id,
            "messages": [
                {
                    "type": "text", // ①
                    "text": hTxt,
                    "quickReply": { // ②
                        "items": [
                            {
                                "type": "action", // ③
                                "action": {
                                    "type": "message",
                                    "label": btnTxt,
                                    "text": btnTxt
                                }
                            },

                        ]
                    }
                }
            ]




        })

    };
    request(options, function (error, response) {
        if (error) console.log(error);
        console.log(response.body);
    });

}

/**
 * 
 * @param {string} user_id : Unique User ID of the students.
 * @param {*} hTxt : Header Text
 * @param {*} btnTxt : Button Text
 */
const sendListMessage = async (user_id, Title, data) => {
    var options = {
        'method': 'POST',
        'url': 'https://api.line.me/v2/bot/message/push',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': process.env.channel_access_token,
        },
        body: JSON.stringify({
            "to": user_id,
            "messages": [
                {
                    "type": "text", // ①
                    "text": Title,
                    "quickReply": { // ②
                        "items": data
                    }

                }
            ]
        })

    };
    request(options, function (error, response) {
        if (error) console.log(error);
        console.log(response.body);
    });

}

/**
 * 
 * @param {string} name - Name of the student
 * @param {string} user_id - Unique User ID of the students.
 */
const sendLineTemplate = async (name, user_id) => {
    var options = {
        'method': 'POST',
        'url': 'https://api.line.me/v2/bot/message/push',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': process.env.channel_access_token,
        },
        body: JSON.stringify({
            "to": user_id,
            "messages": [
                {
                    "type": "text", // ①
                    "text": `Hello ${name},
Welcome to the FREE business training program - WomenWill! 

Click below to start.`,
                    "quickReply": { // ②
                        "items": [
                            {
                                "type": "action", // ③
                                "action": {
                                    "type": "message",
                                    "label": "Start",
                                    "text": "Start "
                                }
                            },

                        ]
                    }

                }
            ]

        })

    };
    request(options, function (error, response) {
        if (error) console.log(error);
        console.log(response.body);
    });
}

/**
 * Send text message
 * @param {string} user_id : Unique User ID of the students.
 * @param {*} text : Text Message
 */
const sendText = async (user_id, text) => {
    var options = {
        'method': 'POST',
        'url': 'https://api.line.me/v2/bot/message/push',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': process.env.channel_access_token,
        },
        body: JSON.stringify({
            "to": user_id,
            "messages": [
                {
                    "type": "text",
                    "text": text
                }
            ]
        })

    };
    request(options, function (error, response) {
        if (error) console.error(error);
        console.log(response.body);
    });

}

/**
 * Get User information
 * @param {string} user_id - Unique User ID of the students. 
 * @returns 
 */
const getUserInfo = async (user_id) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'GET',
            'url': 'https://api.line.me/v2/bot/profile/' + user_id,
            'headers': {
                'Authorization': process.env.channel_access_token
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            //console.log(response.body);
            resolve(response.body);
        });
    })

}

/**
 * Send images and videos
 * @param {string} user_id - Unique User ID of the students. 
 * @param {string} url - File URL
 * @param {string} type - content type of the media
 */
const sendMedia = async (user_id, url, type) => {
    var options = {
        'method': 'POST',
        'url': 'https://api.line.me/v2/bot/message/push',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': process.env.channel_access_token,
        },
        body: JSON.stringify({
            "to": user_id,
            "messages": [
                {
                    "type": type,
                    "originalContentUrl": url,
                    "previewImageUrl": url
                }
            ]
        })

    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });

}

/**
 * Send .txt, .pdf files
 * @param {string} user_id - Unique User ID of the students.
 * @param {string} filename - Name of the document
 * @param {object} uri - 
 */
const sendDocuments = async (user_id, filename, uri) => {
    var options = {
        'method': 'POST',
        'url': 'https://api.line.me/v2/bot/message/push',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': process.env.channel_access_token
        },
        body: JSON.stringify({
            "to": user_id,
            "messages": [
                {
                    "type": "template",
                    "altText": "This is a buttons template",
                    "template": {
                        "type": "buttons",

                        "text": filename,

                        "actions": [
                            {
                                "type": "uri",
                                "label": "View File", //Button Text
                                "uri": uri//Incoming Text
                            },
                        ]
                    }
                }
            ]
        })

    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
}


module.exports = { sendText, getUserInfo, sendMedia, sendDocuments, sendInteractiveMsg, sendListMessage, sendLineTemplate }