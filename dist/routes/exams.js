"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _exams = require("../controllers/exams");

var _exams2 = _interopRequireDefault(_exams);

var _auth = require("../middleware/auth");

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
    /* Routes for exams */
    app.route("/exams/addQuestion").post(_auth2.default.requiresAdminHrInterviewee, _exams2.default.add_questions);

    app.route("/exams/getAllQuestions/:job_profile").get(_exams2.default.get_all_questions);

    app.route("/exams/getQuestionById/:questionId").get(_auth2.default.requiresAdminHrInterviewee, _exams2.default.getQuestionById);

    app.route("/exams/updateQuestion/:questionId").post(_auth2.default.requiresAdminHrInterviewee, _exams2.default.update_questions);

    app.route("/exams/deleteQuestion/:questionId").get(_auth2.default.requiresAdminHrInterviewee, _exams2.default.delete_questions);

    app.route("/exams/job_profile").post(_exams2.default.getJobprofiles);

    app.route("/exams/submitExam").post(_exams2.default.examResult);

    app.route("/exams/showExamResult").post(_auth2.default.requiresAdminHrInterviewee, _exams2.default.show_exam_result);

    app.route("/exams/verifyExamToken").post(_exams2.default.verify_otp);

    app.route("/exams/examSubjects").post(_auth2.default.requiresAdminHrInterviewee, _exams2.default.examSubjects);

    app.route("/exams/getExamSubjects").get(_auth2.default.requiresAdminHrInterviewee, _exams2.default.getExamSubjects);

    app.route("/exams/getQuestionsForAdmin/:job_profile").get(_auth2.default.requiresAdminHrInterviewee, _exams2.default.getQuestions);

    app.route("/exams/addNewCandidate").post(_exams2.default.addCandidate);

    app.route("/exams/getPendingList").get(_auth2.default.requiresAdminHrInterviewee, _exams2.default.getPendingCandidate);

    app.route("/exams/getCandidateResult").post(_auth2.default.requiresAdminHrInterviewee, _exams2.default.getCandidateResult);

    app.route("/exams/approveCandidate").post(_auth2.default.requiresAdminHrInterviewee, _exams2.default.approveCandidate);

    return app;
};
//# sourceMappingURL=exams.js.map