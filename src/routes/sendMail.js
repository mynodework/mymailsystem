import sendMail from "../controllers/sendMail";
import auth from "../middleware/auth";

export default (app) => {

    /* Route for sending mail */
    app.route("/sendMail").post(sendMail.send_mail);

    app.route("/updateEmails").post(sendMail.updateEmails);

    return app;
};