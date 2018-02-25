import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import config from "../config";
import constant from "../models/constant";
import smtp from "../models/";
import _ from "lodash";

module.exports = {
    send_mail: function(subject, text, html, filename, content, smtp_info) {
        return new Promise((resolve, reject) => {
            let mailer = nodemailer.createTransport(smtpTransport({
                host: smtp_info.smtp_server,
                port: parseInt(smtp_info.server_port),
                auth: {
                    user: smtp_info.username,
                    pass: smtp_info.password
                }
            }));
            mailer.sendMail({
                from: smtp_info.email,
                to: smtp_info.email,
                subject: subject,
                template: text || "",
                html: html,
                attachments: [{
                    filename: filename,
                    content: content
                }]
            }, (error, response) => {
                if (error) {
                    reject("message not sent successfully");
                } else {
                    resolve({ message: "messsage sent successfully", status: 1, email_response: response, subject: subject, body: html });
                }
                mailer.close();
            });
        })
    },

    updateMails: function(email) {
        return new Promise((resolve, reject) => {
            email.find({ updatedAt: { "$exists": false } }).limit(2000).then((data) => {
                if (data.length != 0) {
                    _.forEach(data, (val, key) => {
                        email.update({ _id: val._id }, { $set: { updatedAt: val.date } }).then((updated) => {
                            if (key == data.length - 1) {
                                resolve("updated")
                            }
                        })
                    })
                } else {
                    reject("all emails are updated")
                }
            }, (err) => { reject(err) })
        })
    }
}