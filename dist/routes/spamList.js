"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _spamList = require("../controllers/spamList");

var _spamList2 = _interopRequireDefault(_spamList);

var _auth = require("../middleware/auth");

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
    /* Route for Template Variable Create  */
    app.route("/spamData/add").post(_auth2.default.requiresAdmin, _spamList2.default.create);

    /* Route for Template spamList update  */
    app.route("/spamList/update/:spamListId").put(_auth2.default.requiresAdmin, _spamList2.default.update);

    /* Route for Template spamList Delete */
    app.route("/spamList/delete/:spamListId").delete(_auth2.default.requiresAdmin, _spamList2.default.deletespamList);

    /* Route for List of spamList Template */
    app.route("/spamList/get/:page/:limit").get(_auth2.default.requiresAdmin, _spamList2.default.spamList);

    /*spamList get by id*/
    app.route("/spamList/getById/:spamListId").get(_auth2.default.requiresAdmin, _spamList2.default.getspamListById);

    /*Remove spam from job profile*/
    app.route("/remove/spamFromJobProfile").put(_auth2.default.requiresAdmin, _spamList2.default.removeSpam);

    /*mark as spam*/
    app.route("/spam/candidate/:email").put(_auth2.default.requiresAdminOrHr, _spamList2.default.spamCandidate);

    app.param("spamListId", _spamList2.default.idResult);

    return app;
};
//# sourceMappingURL=spamList.js.map