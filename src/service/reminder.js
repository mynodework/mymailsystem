import constant from '../models/constant'
import moment from 'moment'
import mail from '../modules/mail'
import replaceData from "../modules/replaceVariable";
import db from "../db";
import email_log from "./emaillogs.js";
import { Promise, reject } from 'bluebird';
import { resolve } from 'dns';
import EmailToNotViewed from './sendEmailToNotViewed';
import slack from '../service/sendSlackNotification';

let reminderMail = (email, logs) => {
    return new Promise((resolve, reject) => {
        let dateTime = new Date();
        let start = moment(dateTime).format("YYYY-MM-DD"); //currnet date 
        let end = moment(start).add(1, 'days').format("YYYY-MM-DD"); // next date
        let id_list = []
        email.find({ shedule_date: { "$gte": start, "$eq": end } }, { "shedule_date": 1, "shedule_time": 1, "tag_id": 1, "from": 1, "send_template": 1, "sender_mail": 1, "shedule_for": 1 }).exec(function(err, response) {
            if (response.length) {
                sendReminder(response, function(reminder_status) {
                    email.update({ "_id": { "$in": id_list } }, { reminder_send: 1 }, { multi: true }).exec(function(err, update_response) {
                        if (!err) {
                            resolve(reminder_status)
                        }
                    })
                })
            } else {
                resolve("No email is sheduled for tomorrow")
            }
        })

        function sendReminder(mail_data, callback) { // function for sending reminder
            let user_info = mail_data.splice(0, 1)[0];
            id_list.push(user_info._id)
            db.Template.findById(parseInt(user_info.send_template)) // finding template that is send to candiadte
                .then((template_data) => {
                    replaceData.filter(template_data.body, user_info.from, user_info.tag_id[0], user_info.shedule_date, user_info.shedule_time) // replace user variables
                        .then((replaced_data) => {
                            db.Smtp.findOne({ where: { status: 1 } })
                                .then((smtp) => {
                                    let subject = constant().reminder + " " + moment(user_info.shedule_date).format("MMMM Do YYYY") + " at " + user_info.shedule_time // subject for remonder email
                                    mail.sendScheduledMail(user_info.sender_mail, subject, "", smtp, replaced_data) // sending email
                                        .then((mail_response) => {
                                            db.Tag.findById(parseInt(user_info.tag_id)).then((job_profile) => {
                                                let slack_message = constant().slack_reminder + "\n" + "Candidate name: " + user_info.from + "\n" + " Email: " + user_info.sender_mail + "\n" + "Job profile: " + job_profile.title + "\n" + "Round: " + user_info.shedule_for + "\n" + " At: " + user_info.shedule_time + "\n" + constant().candidate_url + user_info._id;
                                                slack.slackNotification(slack_message, user_info.sender_mail).then((slack_response) => {
                                                    if (slack_response == 200) {
                                                        console.log("slack notification sent")
                                                    }
                                                })
                                            })
                                            mail_response['user'] = "Reminder";
                                            email_log.emailLog(logs, mail_response).then((mail_log) => {
                                                if (mail_data.length) {
                                                    sendReminder(mail_data, callback)
                                                } else {
                                                    callback({ message: "Reminder Sent To Selected Users" })
                                                }
                                            })
                                        })
                                })
                        })
                })
        }
    })
}


let sendEmailToPendingCandidate = (cron_service, logs, email, emailTrack) => {
    return new Promise((resolve, reject) => {
        cron_service.findOne({ status: 1, work: constant().pending_work }).exec(function(err, cronWorkData) {
            if (cronWorkData && cronWorkData.get('candidate_list').length) {
                db.Smtp.findOne({ where: { status: 1 } })
                    .then((smtp) => {
                        db.Template.findById(cronWorkData.get('template_id')).then((template) => {
                            email.find({ _id: cronWorkData.get('candidate_list')[0]._id, "$or": [{ is_automatic_email_send: 0 }, { is_automatic_email_send: { "$exists": false } }] }, { "_id": 1, "sender_mail": 1, "from": 1, "is_automatic_email_send": 1, "subject": 1 }).exec(function(err, result) {
                                if (result) {
                                    sendTemplateToEmails(cronWorkData.get('candidate_list')[0], template, smtp, function(err, data) {
                                        if (err) {
                                            reject(err)
                                        } else {
                                            resolve(data)
                                        }
                                    })
                                } else {
                                    cron_service.update({ _id: cronWorkData.get('_id') }, { $pull: { candidate_list: cronWorkData.get('candidate_list')[0] } }).exec(function(err, updated_cronWork) {
                                        if (!err) {
                                            console.log(updated_cronWork)
                                            resolve("Email Sent To candidate")
                                        }
                                    })
                                }
                            })
                        })

                        function sendTemplateToEmails(emails, template, smtp, callback) {
                            let subject = "";
                            console.log(emails)
                            if (!smtp) {
                                callback("Not active Smtp", null);
                            }
                            let email_id = emails;
                            replaceData.filter(template.body, email_id.from, emails.tag_id)
                                .then((html) => {
                                    subject = template.subject;
                                    mail.sendMail(email_id.sender_mail, subject, constant().smtp.text, smtp, html, true)
                                        .then((response) => {
                                            response['user'] = cronWorkData.get('user');
                                            response['tag_id'] = emails.tag_id;
                                            email_log.emailLog(logs, response)
                                                .then((log_response) => {
                                                    email.update({ "_id": email_id._id }, { is_automatic_email_send: 1, send_template_count: 1, template_id: [template.id], reply_to_id: response.reply_to })
                                                        .then((data1) => {
                                                            cron_service.update({ _id: cronWorkData.get('_id') }, { "$pull": { candidate_list: emails } }).exec(function(err, updated_cronWork) {
                                                                if (!err) {
                                                                    let tracking_info = {
                                                                        candidate_email: email_id.sender_mail,
                                                                        tracking_id: response.tracking_id,
                                                                        sent_time: new Date(),
                                                                        tag_id: cronWorkData.get('tag_id')
                                                                    }
                                                                    emailTrack.create(tracking_info).then((info) => {
                                                                        email.update({ sender_mail: email_id.sender_mail }, { email_track: info._id }, { multi: true }).then((res) => {
                                                                            callback(null, "email sent to pending candidate")
                                                                        })
                                                                    })
                                                                }
                                                            })
                                                        })
                                                })
                                        })

                                })

                        }
                    })
            } else {
                cron_service.findOneAndUpdate({ status: 1, work: constant().pending_work }, { $set: { status: 0 } }).exec(function(err, update_status) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve("Nothing in Pending")
                    }
                })
            }
        })
    })
}


let sendEmailToNotRepliedCandidate = (cron_service, logs, email, emailTrack) => {
    return new Promise((resolve, reject) => {
        cron_service.findOne({ status: 1, work: constant().not_replied }).then((cronWorkData) => {
            if (cronWorkData && cronWorkData.get('candidate_list').length) {
                db.Smtp.findOne({ where: { status: 1 } })
                    .then((smtp) => {
                        sendTemplateToEmails(cronWorkData, smtp, function(err, response) {
                            resolve("SUCCESS")
                        })

                        function sendTemplateToEmails(cronWorkData, smtp, callback) {
                            let subject = cronWorkData.get('subject');
                            let candidate_info = cronWorkData.get("candidate_list")[0];
                            if (!smtp) {
                                callback("Not active Smtp", null);
                            }
                            replaceData.filter(cronWorkData.get('body'), candidate_info.from, cronWorkData.tag_id)
                                .then((html) => {
                                    mail.sendMail(candidate_info.sender_mail, subject, constant().smtp.text, smtp, html).then((mail_response) => {
                                        email_log.emailLog(logs, mail_response)
                                            .then((log_response) => {
                                                email.update({ _id: candidate_info._id }, { $inc: { send_template_count: 1 }, $push: { template_id: parseInt(cronWorkData.get('template_id')) }, is_automatic_email_send: 1 }).then((response) => {
                                                    cron_service.findOneAndUpdate({ _id: cronWorkData._id }, { "$pull": { candidate_list: candidate_info } }).then((updated_cronWork) => {
                                                        let tracking_info = {
                                                            candidate_email: candidate_info,
                                                            tracking_id: mail_response.tracking_id,
                                                            sent_time: new Date(),
                                                            tag_id: cronWorkData.get('tag_id'),
                                                            campaign_name: cronWorkData.get('campaign_name'),
                                                            subject: cronWorkData.get('subject'),
                                                            body: cronWorkData.get('body')
                                                        }
                                                        emailTrack.create(tracking_info).then((info) => {
                                                            email.update({ sender_mail: candidate_info }, { email_track: info._id }, { multi: true }).then((res) => {
                                                                callback(null, updated_cronWork)
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                    })
                                })
                        }
                    })
            } else {
                cron_service.findOneAndUpdate({ status: 1, work: constant().not_replied }, { $set: { status: 0 } }).exec(function(err, update_status) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve("Nothing in Pending")
                    }
                })
            }
        })
    });
}

let sendToSelected = (cron_service, logs, email, emailTrack) => {
    return new Promise((resolve, reject) => {
        cron_service.findOne({ status: 1, work: constant().selectedCandidate }).then((cronWorkData) => {
            if (cronWorkData != null ? cronWorkData.get('candidate_list').length : false) {
                db.Smtp.findOne({ where: { status: 1 } }).then((smtp) => {
                    let email_data = cronWorkData.get('candidate_list')[0];
                    mail.sendMail(email_data, cronWorkData.get('subject'), constant().smtp.text, smtp, cronWorkData.get('body')).then((mail_response) => {
                        email_log.emailLog(logs, mail_response)
                            .then((log_response) => {
                                cron_service.findOneAndUpdate({ _id: cronWorkData._id }, { "$pull": { candidate_list: email_data } }).then((updated_cronWork) => {
                                    let tracking_info = {
                                        candidate_email: email_data,
                                        tracking_id: mail_response.tracking_id,
                                        sent_time: new Date(),
                                        campaign_name: cronWorkData.get('campaign_name'),
                                        subject: cronWorkData.get('subject'),
                                        body: cronWorkData.get('body')
                                    }
                                    emailTrack.create(tracking_info).then((info) => {
                                        email.update({ sender_mail: email_data }, { email_track: info._id, unread: false }, { multi: true }).then((res) => {
                                            resolve("SUCCESS")
                                        })
                                    })
                                })
                            })
                    })
                })
            } else {
                if (!cronWorkData) {
                    resolve("Nothing In Pending")
                } else {
                    cron_service.findOneAndUpdate({ _id: cronWorkData.get('_id') }, { status: 0 }).then((updated_cronWork) => {
                        resolve("Nothing In Pending")
                    })
                }
            }
        })
    });
}

let sendToAll = (cron_service, logs, email, emailTrack) => {
    return new Promise((resolve, reject) => {
        cron_service.findOne({ status: 1, work: constant().sendToAll }).then((cronWorkData) => {
            if (cronWorkData != null ? cronWorkData.get('candidate_list').length : false) {
                db.Smtp.findOne({ where: { status: 1 } }).then((smtp) => {
                    let email_data = cronWorkData.get('candidate_list').splice(0, 1)[0];
                    mail.sendMail(email_data, cronWorkData.get('subject'), constant().smtp.text, smtp, cronWorkData.get('body'), false, cronWorkData.get('_id')).then((mail_response) => {
                        email_log.emailLog(logs, mail_response)
                            .then((log_response) => {
                                let tracking_info = {
                                    candidate_email: email_data,
                                    tracking_id: mail_response.tracking_id,
                                    sent_time: new Date(),
                                    tag_id: cronWorkData.get('tag_id'),
                                    campaign_name: cronWorkData.get('campaign_name'),
                                    subject: cronWorkData.get('subject'),
                                    body: cronWorkData.get('body')
                                }
                                emailTrack.create(tracking_info).then((info) => {
                                    cron_service.findOneAndUpdate({ _id: cronWorkData._id }, { candidate_list: cronWorkData.get('candidate_list') }).then((updated_cronWork) => {
                                        email.update({ sender_mail: email_data }, { email_track: info._id }, { multi: true }).then((res) => {
                                            resolve("SUCCESS")
                                        })
                                    })
                                })
                            })
                    })
                })
            } else {
                if (!cronWorkData) {
                    resolve("Nothing In Pending")
                } else {
                    cron_service.findOneAndUpdate({ _id: cronWorkData.get('_id') }, { status: 0 }).then((updated_cronWork) => {
                        resolve("Nothing In Pending")
                    })
                }
            }
        })
    });
}

let resendEmail = (cron_service, logs, email, emailTrack) => {
    return new Promise((resolve, reject) => {
        cron_service.find({ status: 1, work: constant().resendEmail }).then((candidate_info) => {
            if (candidate_info.length) {
                let candidate = candidate_info.splice(0, 1)[0]
                db.Smtp.findOne({ where: { status: 1 } }).then((smtp_data) => {
                    if (smtp_data) {
                        let email_id = candidate.get('candidate_list').splice(0, 1)[0]
                        EmailToNotViewed.sendEmailToNotViewed(smtp_data, email_id, candidate).then((mail_response) => {
                            email_log.emailLog(logs, mail_response).then((log_response) => {
                                if (candidate.get('candidate_list').length) {
                                    cron_service.update({ _id: candidate._id }, { candidate_list: candidate.get('candidate_list') }).then((response) => {
                                        let tracking_info = {
                                            candidate_email: email_id.email,
                                            tracking_id: mail_response.tracking_id,
                                            sent_time: new Date(),
                                            tag_id: candidate.get('tag_id'),
                                            campaign_name: candidate.get('campaign_name'),
                                            subject: candidate.get('subject'),
                                            body: candidate.get('body')
                                        }
                                        emailTrack.create(tracking_info).then((info) => {
                                            email.update({ sender_mail: email_id }, { email_track: info._id }, { multi: true }).then((res) => {
                                                resolve("SUCCESS")
                                            })
                                        })
                                    })
                                } else {
                                    cron_service.update({ _id: candidate._id }, { candidate_list: candidate.get('candidate_list'), status: 0 }).then((response) => {
                                        let tracking_info = {
                                            candidate_email: email_id.email,
                                            tracking_id: mail_response.tracking_id,
                                            sent_time: new Date(),
                                            tag_id: candidate.get('tag_id'),
                                            campaign_name: candidate.get('campaign_name'),
                                            subject: candidate.get('subject'),
                                            body: candidate.get('body')
                                        }
                                        emailTrack.create(tracking_info).then((info) => {
                                            email.update({ sender_mail: email_id }, { email_track: info._id }, { multi: true }).then((res) => {
                                                resolve("SUCCESS")
                                            })
                                        })
                                    })
                                }
                            })
                        })
                    } else {
                        reject("No Active SMTP...")
                    }
                })
            } else {
                resolve()
            }
        })
    })
}
export default {
    reminderMail,
    sendEmailToPendingCandidate,
    sendEmailToNotRepliedCandidate,
    sendToSelected,
    sendToAll,
    resendEmail
}