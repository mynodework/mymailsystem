"use strict";

var _nodemailer = require("nodemailer");

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _nodemailerSmtpTransport = require("nodemailer-smtp-transport");

var _nodemailerSmtpTransport2 = _interopRequireDefault(_nodemailerSmtpTransport);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

var _constant = require("../models/constant");

var _constant2 = _interopRequireDefault(_constant);

var _models = require("../models/");

var _models2 = _interopRequireDefault(_models);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    send_mail: function send_mail(subject, text, html, filename, content, smtp_info) {
        return new Promise(function (resolve, reject) {
            var mailer = _nodemailer2.default.createTransport((0, _nodemailerSmtpTransport2.default)({
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
            }, function (error, response) {
                if (error) {
                    reject("message not sent successfully");
                } else {
                    resolve({ message: "messsage sent successfully", status: 1, email_response: response, subject: subject, body: html });
                }
                mailer.close();
            });
        });
    },

    updateMails: function updateMails(email) {
        return new Promise(function (resolve, reject) {
            email.find({ updatedAt: { "$exists": false } }).limit(2000).then(function (data) {
                if (data.length != 0) {
                    _lodash2.default.forEach(data, function (val, key) {
                        email.update({ _id: val._id }, { $set: { updatedAt: val.date } }).then(function (updated) {
                            if (key == data.length - 1) {
                                resolve("updated");
                            }
                        });
                    });
                } else {
                    reject("all emails are updated");
                }
            }, function (err) {
                reject(err);
            });
        });
    }
};
//# sourceMappingURL=send_mail.js.map