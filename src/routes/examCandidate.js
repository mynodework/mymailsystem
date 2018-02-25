import examCandidate from "../controllers/examCandidate";
// import auth from "../middleware/auth";

export default (app) => {
    /* Route for fetch email from mongoDb  */
    app.route("/exam/signup_login_fb").post(examCandidate.exam_candidate);
    return app;
};