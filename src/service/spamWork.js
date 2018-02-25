import constant from "../models/constant";
import _ from "lodash";

const removeSpam = (req, db) => {
    return new Promise((resolve, reject) => {
        findSpamContactList().then((spamListContacts) => {
            findSpamEmails(spamListContacts).then((spamEmails) => {
                req.spamBox.insertMany(spamEmails.emails).then((spamDataMoved) => {
                    req.email.find({ sender_mail: { $in: spamListContacts }}).remove().then((response) => {
                        resolve({ message: "Emails Are moved into SpamList" })
                    })
                })
            })

        })

        function findSpamContactList() {
            return new Promise((resolve, reject) => {
                let email_lists = []
                db.SpamList.findAll().then((spamListContacts) => {
                    _.forEach(spamListContacts, (val, key) => {
                        email_lists.push(val['email'])
                        if (key == spamListContacts.length - 1) {
                            resolve(email_lists)
                        }
                    })
                })
            });
        }

        function findSpamEmails(spamListContacts) {
            return new Promise((resolve, reject) => {
                let spam_ids = []
                req.email.find({ sender_mail: { $in: spamListContacts } }).then((spamEmails) => {
                    if (spamEmails.length) {
                        _.forEach(spamEmails, (val, key) => {
                            spam_ids.push(val._id)
                            if (key == spamEmails.length - 1) {
                                resolve({ emails: spamEmails, ids: spam_ids })
                            }
                        })
                    } else {
                        resolve({ emails: [], ids: [] })
                    }

                })
            });
        }
    })
}

export default {
    removeSpam
}