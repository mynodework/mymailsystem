import exams from "../controllers/exams";
import auth from "../middleware/auth";

export default (app) => {
    /* Routes for exams */
    app.route("/exams/addQuestion").post(auth.requiresAdminHrInterviewee, exams.add_questions);

    app.route("/exams/getAllQuestions/:job_profile").get(exams.get_all_questions);

    app.route("/exams/getQuestionById/:questionId").get(auth.requiresAdminHrInterviewee, exams.getQuestionById);

    app.route("/exams/updateQuestion/:questionId").post(auth.requiresAdminHrInterviewee, exams.update_questions);

    app.route("/exams/deleteQuestion/:questionId").get(auth.requiresAdminHrInterviewee, exams.delete_questions);

    app.route("/exams/job_profile").post(exams.getJobprofiles);

    app.route("/exams/submitExam").post(exams.examResult);

    app.route("/exams/showExamResult").post(auth.requiresAdminHrInterviewee, exams.show_exam_result);

    app.route("/exams/verifyExamToken").post(exams.verify_otp);

    app.route("/exams/examSubjects").post(auth.requiresAdminHrInterviewee, exams.examSubjects);

    app.route("/exams/getExamSubjects").get(auth.requiresAdminHrInterviewee, exams.getExamSubjects);

    app.route("/exams/getQuestionsForAdmin/:job_profile").get(auth.requiresAdminHrInterviewee, exams.getQuestions);

    app.route("/exams/addNewCandidate").post(exams.addCandidate)

    app.route("/exams/getPendingList").get(auth.requiresAdminHrInterviewee, exams.getPendingCandidate)

    app.route("/exams/getCandidateResult").post(auth.requiresAdminHrInterviewee, exams.getCandidateResult)

    app.route("/exams/approveCandidate").post(auth.requiresAdminHrInterviewee, exams.approveCandidate)

    return app;
};