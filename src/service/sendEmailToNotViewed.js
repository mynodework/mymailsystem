import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import constant from "../models/constant";

module.exports = {
    sendEmailToNotViewed: function(smtp, email, candidate) {
        return new Promise((resolve, reject) => {
            let tracking_id = email.email + Math.random().toString(36).substr(2, 9)
            let html = candidate.get('body') + `<img src="${constant().base_track_url}/${email.email}/${tracking_id}">`;
            let mailer = nodemailer.createTransport(smtpTransport({
                host: smtp.smtp_server,
                port: parseInt(smtp.server_port),
                auth: {
                    user: smtp.username,
                    pass: smtp.password
                }
            }));

            mailer.sendMail({
                from: smtp.email,
                to: email.email,
                subject: candidate.get('subject'),
                html: html
            }, (error, response) => {
                if (error) {
                    reject("Invalid Smtp Information");
                } else {
                    resolve({ message: "messsage send successfully", status: 1, email_response: response, subject: candidate.get('subject'), body: candidate.get('body'), tracking_id: tracking_id });
                }
                mailer.close();
            });
        })
    }
}