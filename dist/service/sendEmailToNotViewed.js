"use strict";

var _nodemailer = require("nodemailer");

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _nodemailerSmtpTransport = require("nodemailer-smtp-transport");

var _nodemailerSmtpTransport2 = _interopRequireDefault(_nodemailerSmtpTransport);

var _constant = require("../models/constant");

var _constant2 = _interopRequireDefault(_constant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    sendEmailToNotViewed: function sendEmailToNotViewed(smtp, email, candidate) {
        return new Promise(function (resolve, reject) {
            var tracking_id = email.email + Math.random().toString(36).substr(2, 9);
            var html = candidate.get('body') + ("<img src=\"" + (0, _constant2.default)().base_track_url + "/" + email.email + "/" + tracking_id + "\">");
            var mailer = _nodemailer2.default.createTransport((0, _nodemailerSmtpTransport2.default)({
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
            }, function (error, response) {
                if (error) {
                    reject("Invalid Smtp Information");
                } else {
                    resolve({ message: "messsage send successfully", status: 1, email_response: response, subject: candidate.get('subject'), body: candidate.get('body'), tracking_id: tracking_id });
                }
                mailer.close();
            });
        });
    }
};
//# sourceMappingURL=sendEmailToNotViewed.js.map