import inboxContent from "../controllers/inboxContent";
import auth from "../middleware/auth";

export default (app) => {

    /* Route for List of Variable Template */
    app.route("/new/inboxContent/:emailLimit/:page_no").get(/*auth.requiresLogin,*/ inboxContent.inbox);

    return app;
};
