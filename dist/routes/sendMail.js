"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sendMail = require("../controllers/sendMail");

var _sendMail2 = _interopRequireDefault(_sendMail);

var _auth = require("../middleware/auth");

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {

    /* Route for sending mail */
    app.route("/sendMail").post(_sendMail2.default.send_mail);

    app.route("/updateEmails").post(_sendMail2.default.updateEmails);

    return app;
};
//# sourceMappingURL=sendMail.js.map