import mongoose from "mongoose";
import config from "../config";
let db = config.mongodb || process.env.mongodb;
if (!db) {
    console.log("Mongodb information is not fount update config details");
    process.exit(0)
}
// let conn = mongoose.createConnection("mongodb://localhost/" + db);

let conn = 'mongodb://root:java123@ds247698.mlab.com:47698/mymailsystem';
// conn = mongoose.connect(conn)

// mongodb://<dbuser>:<dbpassword>@ds247698.mlab.com:47698/mymailsystem
import cronService from "../service/cron.js";
import rearrangeDatabase from "../service/rearrangeDb.js";
// the middleware function
module.exports = function() {

    // create schema
    let emailSchema = mongoose.Schema({
        email_id: { type: Number },
        from: { type: String },
        to: { type: String },
        sender_mail: { type: String },
        date: { type: Date },
        email_date: { type: Date },
        email_timestamp: { type: String },
        subject: { type: String },
        unread: { type: Boolean },
        answered: { type: Boolean },
        is_automatic_email_send: { type: Number },
        uid: { type: Number },
        body: { type: String },
        tag_id: { type: Array },
        default_tag: { type: String },
        imap_email: { type: String },
        genuine_applicant: { type: String },
        attachment: { type: Array },
        is_attachment: { type: Boolean },
        shedule_for: { type: String },
        shedule_date: { type: Date },
        shedule_time: { type: String },
        push_message: { type: Array },
        push_status: { type: Boolean },
        registration_id: { type: Number },
        mobile_no: { type: String },
        updated_time: { type: Date },
        send_template: { type: String },
        read_email_time: { type: Date },
        read_by_user: { type: String },
        reminder_send: { type: Boolean },
        send_template_count: { type: Number },
        template_id: { type: Array },
        notes: { type: Array },
        reply_to_id: { type: String },
        email_track: { type: String },
        interviewee: { type: Number },
        source: { type: String },
        fb_id: { type: Number },
        examScore: { type: Number },
        exam_date: { type: Date },
        candidate_status: { type: Boolean },
        candidate_star: { type: Array },
        updatedAt: { type: Date }
    }, {
        collection: "emailStored",
        strict: false,
        timestamps: false
    });

    let userActivity = mongoose.Schema({}, {
        collection: 'userActivity',
        strict: false
    })
    let emailLogs = mongoose.Schema({
        email: { type: Array },
        from: { type: String },
        time: { type: Date },
        user: { type: String },
        subject: { type: String },
        body: { type: String },
        tag_id: { type: Array },
    }, {
        collection: 'emaillogs',
        strict: true
    })
    let cron_work = mongoose.Schema({}, {
        collection: 'cronWork',
        strict: false
    })

    let archive_emails = mongoose.Schema({}, {
        collection: 'archivedMails',
        strict: false
    })

    let email_track = mongoose.Schema({}, {
        collection: 'email_track',
        timeStamp: true,
        strict: false
    })

    let spamBox = mongoose.Schema({}, {
        collection: 'SpamEmails',
        timeStamp: true,
        strict: false
    })

    let examQuestions = mongoose.Schema({
        question: { type: String },
        description: { type: String },
        options: { type: Array },
        job_profile: { type: Array },
        answer: { type: Number },
        user: { type: String },
        exam_subject: { type: Number }
    }, {
        collection: 'examQuestions',
        strict: true
    })

    let candidateResult = mongoose.Schema({
        fb_id: { type: String },
        questionIds: { type: Array },
        answers: { type: Array },
        exam_score: { type: Number },
        taken_time_minutes: { type: Number },
    }, {
        collection: 'candidateResult',
        strict: true
    })

    let history = mongoose.Schema({}, {
        collection: 'History',
        timeStamp: true,
        strict: false
    })

    let email = conn.model("EMAIL", emailSchema);
    let user_activity = conn.model('ACTIVITY', userActivity);
    let email_logs = conn.model('EMAILLOGS', emailLogs);
    let cronWork = conn.model('CRONSTATUS', cron_work);
    let archivedMails = conn.model('ARCHIVED', archive_emails);
    let emailTrack = conn.model('EMAILTRACK', email_track);
    let spamInbox = conn.model('SPAM', spamBox)
    let exam_questions = conn.model('QUESTIONS', examQuestions)
    let candidate_result = conn.model('RESULT', candidateResult)
    let candidate_history = conn.model('REPLIEDEMAILS', history)

    cronService.cron(email, email_logs, spamInbox, candidate_history)
    cronService.reminder(email, email_logs)
    cronService.PendingEmails(cronWork, email_logs, email, emailTrack);
    // rearrangeDatabase.reArrange(email, candidate_history)  all db is synced

    return function(req, res, next) {
        req.email = email;
        req.user_activity = user_activity;
        req.emailLogs = email_logs;
        req.cronWork = cronWork;
        req.archived = archivedMails;
        req.emailTrack = emailTrack;
        req.spamBox = spamInbox;
        req.examQuestions = exam_questions;
        req.candidateResult = candidate_result;
        req.history = candidate_history
        next();
    };
};