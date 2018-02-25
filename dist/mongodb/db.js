"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

var _cron = require("../service/cron.js");

var _cron2 = _interopRequireDefault(_cron);

var _rearrangeDb = require("../service/rearrangeDb.js");

var _rearrangeDb2 = _interopRequireDefault(_rearrangeDb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = _config2.default.mongodb || process.env.mongodb;
if (!db) {
    console.log("Mongodb information is not fount update config details");
    process.exit(0);
}
// let conn = mongoose.createConnection("mongodb://localhost/" + db);

var conn = 'mongodb://root:java123@ds247698.mlab.com:47698/mymailsystem';
// conn = mongoose.connect(conn)

// mongodb://<dbuser>:<dbpassword>@ds247698.mlab.com:47698/mymailsystem

// the middleware function
module.exports = function () {

    // create schema
    var emailSchema = _mongoose2.default.Schema({
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

    var userActivity = _mongoose2.default.Schema({}, {
        collection: 'userActivity',
        strict: false
    });
    var emailLogs = _mongoose2.default.Schema({
        email: { type: Array },
        from: { type: String },
        time: { type: Date },
        user: { type: String },
        subject: { type: String },
        body: { type: String },
        tag_id: { type: Array }
    }, {
        collection: 'emaillogs',
        strict: true
    });
    var cron_work = _mongoose2.default.Schema({}, {
        collection: 'cronWork',
        strict: false
    });

    var archive_emails = _mongoose2.default.Schema({}, {
        collection: 'archivedMails',
        strict: false
    });

    var email_track = _mongoose2.default.Schema({}, {
        collection: 'email_track',
        timeStamp: true,
        strict: false
    });

    var spamBox = _mongoose2.default.Schema({}, {
        collection: 'SpamEmails',
        timeStamp: true,
        strict: false
    });

    var examQuestions = _mongoose2.default.Schema({
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
    });

    var candidateResult = _mongoose2.default.Schema({
        fb_id: { type: String },
        questionIds: { type: Array },
        answers: { type: Array },
        exam_score: { type: Number },
        taken_time_minutes: { type: Number }
    }, {
        collection: 'candidateResult',
        strict: true
    });

    var history = _mongoose2.default.Schema({}, {
        collection: 'History',
        timeStamp: true,
        strict: false
    });

    var email = conn.model("EMAIL", emailSchema);
    var user_activity = conn.model('ACTIVITY', userActivity);
    var email_logs = conn.model('EMAILLOGS', emailLogs);
    var cronWork = conn.model('CRONSTATUS', cron_work);
    var archivedMails = conn.model('ARCHIVED', archive_emails);
    var emailTrack = conn.model('EMAILTRACK', email_track);
    var spamInbox = conn.model('SPAM', spamBox);
    var exam_questions = conn.model('QUESTIONS', examQuestions);
    var candidate_result = conn.model('RESULT', candidateResult);
    var candidate_history = conn.model('REPLIEDEMAILS', history);

    _cron2.default.cron(email, email_logs, spamInbox, candidate_history);
    _cron2.default.reminder(email, email_logs);
    _cron2.default.PendingEmails(cronWork, email_logs, email, emailTrack);
    // rearrangeDatabase.reArrange(email, candidate_history)  all db is synced

    return function (req, res, next) {
        req.email = email;
        req.user_activity = user_activity;
        req.emailLogs = email_logs;
        req.cronWork = cronWork;
        req.archived = archivedMails;
        req.emailTrack = emailTrack;
        req.spamBox = spamInbox;
        req.examQuestions = exam_questions;
        req.candidateResult = candidate_result;
        req.history = candidate_history;
        next();
    };
};
//# sourceMappingURL=db.js.map