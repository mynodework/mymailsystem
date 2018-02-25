import fetch_email from "../controllers/fetchEmail";
import auth from "../middleware/auth";

export default (app) => {
    /* Route for fetch email from mongoDb  */
    app.route("/email/fetch/:tag_id/:page/:limit").put(auth.requiresLogin, fetch_email.fetch);

    /* Route for add tag  */
    app.route("/email/assignTag/:tag_id/:mongo_id").put(auth.requiresLogin, fetch_email.assignTag);

    /* Route for count emails on the basis of tag */
    app.route("/email/countEmail").get(auth.requiresLogin, fetch_email.countEmail);

    /* Route for assign Multiple Tag  */
    app.route("/email/assignMultiple/:tag_id").put(auth.requiresAdminOrHr, fetch_email.assignMultiple);

    /* Route for delete Tag  */
    app.route("/email/deleteTag/:tag_id").delete(auth.requiresLogin, fetch_email.deleteTag);

    /* Route for change unread status  */
    app.route("/email/changeUnreadStatus/:mongo_id/:status").put(auth.requiresLogin, fetch_email.changeUnreadStatus);

    /* Route for delete email  */
    app.route("/email/deleteEmail/:tag_id").post(auth.requiresLogin, fetch_email.deleteEmail);

    /* Route for save email attachment  */
    app.route("/email/mailAttachment/:mongo_id").put(auth.requiresLogin, fetch_email.mailAttachment);

    /* fetch email by button */
    app.route("/email/fetchByButton").get(auth.requiresLogin, fetch_email.fetchByButton);

    /*send mails to a list of emails*/
    app.route("/email/sendtomany").post(auth.requiresAdminOrHr, fetch_email.sendToMany);

    /*send to a specified Tag*/
    app.route("/email/send_to_selected_tag").put(auth.requiresAdminOrHr, fetch_email.sendToSelectedTag)

    /*get Candidate status*/
    app.route("/app_get_candidate").post(fetch_email.app_get_candidate)

    /*getting email logs*/
    app.route("/get/email/logs/:page/:limit").get(auth.requiresAdmin, fetch_email.logs)

    /*searching email logs*/
    app.route("/search/email/logs/:email/:page/:limit").get(auth.requiresAdmin, fetch_email.searchLogs)

    /*Getting email status*/
    app.route("/get/emailStatus").put(auth.requiresAdminOrHr, fetch_email.emailStatus)

    /*getting email for last inputed dates*/
    app.route("/fetch/emails/:days").get(auth.requiresAdmin, fetch_email.fetchByDates)

    /*send email to not replied candidate*/
    app.route("/sendToNotReplied").post(auth.requiresAdminOrHr, fetch_email.sendToNotReplied)

    /*send email by selection*/
    app.route("/email/by_seclection").post(auth.requiresAdminOrHr, fetch_email.sendBySelection)

    /*count of pending work*/
    app.route("/email/cron_status").post(auth.requiresAdminOrHr, fetch_email.cron_status)

    /*insert candidates notes*/
    app.route("/candidate_notes/insert").post(auth.requiresAdminHrInterviewee, fetch_email.insert_note)

    /*update candidates notes*/
    app.route("/candidate_notes/update").post(auth.requiresAdminHrInterviewee, fetch_email.update_note)

    /*Archive emails*/
    app.route("/email/archive").put(auth.requiresAdmin, fetch_email.archiveEmails)

    /*Mark as unread*/
    app.route("/email/markAsUnread").put(auth.requiresAdminOrHr, fetch_email.markAsUnread)

    /*get candidate by id*/
    app.route("/email/getById/:mongo_id").get(auth.requiresLogin, fetch_email.getByMongoId)

    /*email tracking*/
    app.route("/track/:email/:tracking_id").get(fetch_email.tracking)

    /*email track status*/
    app.route('/fetch/trackingData').get(auth.requiresAdmin, fetch_email.fetchTrackingData)

    /*Add new candidate*/
    app.route('/add/addNewCandidate').post(auth.requiresAdminOrHr, fetch_email.addNewCandidate)

    /*send email to not viewed */
    app.route('/send/sendEmailToNotviewed').put(auth.requiresAdmin, fetch_email.sendEmailToNotviewed)

    /*assign an interviwee*/
    app.route('/assign/interviewee').post(auth.requiresAdminOrHr, fetch_email.assignAnInterviewee)

    /*fetch candidate by interviewee*/
    app.route('/get/candidate/byInterviewee').get(auth.requiresInterviewee, fetch_email.getCandidateByInterviewee)

    /*delete campaign*/
    app.route('/delete/campaign/:campaign_name').delete(auth.requiresAdmin, fetch_email.deleteCampaign)

    /*Route for find emails by tagId*/
    app.param("tag_id", fetch_email.findByTagId)

    /*Route to mark a mail to see it later*/
    app.route('/star/starEmail/:star').put(auth.requiresAdminHrInterviewee, fetch_email.starEmail)

    /*Route to view marked mails*/
    app.route('/star/getStaredEmails/').get(auth.requiresAdminHrInterviewee, fetch_email.getStaredEmails)

    /*move mails to archive*/
    app.route('/email/candidateArchive/:email').put(auth.requiresAdminOrHr, fetch_email.candidateArchive)

    return app;
};