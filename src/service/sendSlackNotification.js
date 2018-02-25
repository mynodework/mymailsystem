let IncomingWebhook = require('@slack/client').IncomingWebhook;
import db from "../db.js";
import config from "../config";
import request from "request";

const slackNotification = (data, user_email) => {
    return new Promise((resolve, reject) => {
        db.Slack.findOne({ where: { status: true } }).then((slackInfo) => {
            if (slackInfo.id) {
                let url = slackInfo.token || config.slackToken;
                let webhook = new IncomingWebhook(url);
                userIcon(user_email, function(response) {
                    data += "\n picture: " + response;
                    webhook.send(data, function(err, header, statusCode, body) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(statusCode)
                        }
                    });
                })
            } else {
                resolve("No slack information")
            }

            function userIcon(email, callback) {
                request(`http://picasaweb.google.com/data/entry/api/user/${email}?alt=json`, function(error, response, body) {
                    if (!error) {
                        try {
                        callback(JSON.parse(body).entry.gphoto$thumbnail.$t)    
                        }
                        catch(e) {
                            callback("Invalid Email Address")
                        }
                    }
                });
            }
        })

    })
}

export default {
    slackNotification
}