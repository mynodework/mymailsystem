import spamList from "../controllers/spamList";
import auth from "../middleware/auth";

export default (app) => {
    /* Route for Template Variable Create  */
    app.route("/spamData/add").post(auth.requiresAdmin, spamList.create);

    /* Route for Template spamList update  */
    app.route("/spamList/update/:spamListId").put(auth.requiresAdmin, spamList.update);

    /* Route for Template spamList Delete */
    app.route("/spamList/delete/:spamListId").delete(auth.requiresAdmin, spamList.deletespamList);

    /* Route for List of spamList Template */
    app.route("/spamList/get/:page/:limit").get(auth.requiresAdmin, spamList.spamList);

    /*spamList get by id*/
    app.route("/spamList/getById/:spamListId").get(auth.requiresAdmin, spamList.getspamListById);

    /*Remove spam from job profile*/
    app.route("/remove/spamFromJobProfile").put(auth.requiresAdmin, spamList.removeSpam);

    /*mark as spam*/
    app.route("/spam/candidate/:email").put(auth.requiresAdminOrHr, spamList.spamCandidate);

    app.param("spamListId", spamList.idResult);

    return app;
};