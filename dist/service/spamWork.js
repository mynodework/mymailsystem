"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constant = require("../models/constant");

var _constant2 = _interopRequireDefault(_constant);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var removeSpam = function removeSpam(req, db) {
    return new Promise(function (resolve, reject) {
        findSpamContactList().then(function (spamListContacts) {
            findSpamEmails(spamListContacts).then(function (spamEmails) {
                req.spamBox.insertMany(spamEmails.emails).then(function (spamDataMoved) {
                    req.email.find({ sender_mail: { $in: spamListContacts } }).remove().then(function (response) {
                        resolve({ message: "Emails Are moved into SpamList" });
                    });
                });
            });
        });

        function findSpamContactList() {
            return new Promise(function (resolve, reject) {
                var email_lists = [];
                db.SpamList.findAll().then(function (spamListContacts) {
                    _lodash2.default.forEach(spamListContacts, function (val, key) {
                        email_lists.push(val['email']);
                        if (key == spamListContacts.length - 1) {
                            resolve(email_lists);
                        }
                    });
                });
            });
        }

        function findSpamEmails(spamListContacts) {
            return new Promise(function (resolve, reject) {
                var spam_ids = [];
                req.email.find({ sender_mail: { $in: spamListContacts } }).then(function (spamEmails) {
                    if (spamEmails.length) {
                        _lodash2.default.forEach(spamEmails, function (val, key) {
                            spam_ids.push(val._id);
                            if (key == spamEmails.length - 1) {
                                resolve({ emails: spamEmails, ids: spam_ids });
                            }
                        });
                    } else {
                        resolve({ emails: [], ids: [] });
                    }
                });
            });
        }
    });
};

exports.default = {
    removeSpam: removeSpam
};
//# sourceMappingURL=spamWork.js.map