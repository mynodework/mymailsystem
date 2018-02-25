let inbox = require("../inbox");
let CronJob = require("cron").CronJob;
import service from "../service/reminder"

export class CronController {
    cron(email, logs, spamInbox, candidate_history) {
        new CronJob("*/20 * * * *", function() {
            inbox.fetchEmail(email, logs, spamInbox, candidate_history) // running this function every 60 min
                .then((response) => {
                    inbox.skippedDates(email, logs, spamInbox, candidate_history)
                        .then((data) => {
                            inbox.beforeDateEmail(email, logs, spamInbox, candidate_history);
                        })
                });
        }, null, true);
    }

    reminder(email, logs) {
        new CronJob('00 00 18 * * 1-7', function() { // cron is running every day at 06:00 PM
            service.reminderMail(email, logs)
                .then((data) => console.log(data))
        }, null, true);
    }

    PendingEmails(cron_service, logs, email, emailTrack) {
        new CronJob("*/10 * * * * *", function() {
            service.sendEmailToPendingCandidate(cron_service, logs, email, emailTrack)
                .then((response) => {
                    service.sendEmailToNotRepliedCandidate(cron_service, logs, email, emailTrack)
                        .then((email_status) => {
                            service.sendToSelected(cron_service, logs, email, emailTrack)
                                .then((selected_response) => {
                                    service.sendToAll(cron_service, logs, email, emailTrack)
                                        .then((send_to_all_response) => {
                                            service.resendEmail(cron_service, logs, email, emailTrack).then((resend_email_status) => {
                                                console.log(response, email_status, selected_response, send_to_all_response)
                                            })
                                        })
                                })
                        })
                })
        }, null, true)
    }
}
const controller = new CronController();
export default controller;