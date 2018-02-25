"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _examCandidate = require("../controllers/examCandidate");

var _examCandidate2 = _interopRequireDefault(_examCandidate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import auth from "../middleware/auth";

exports.default = function (app) {
    /* Route for fetch email from mongoDb  */
    app.route("/exam/signup_login_fb").post(_examCandidate2.default.exam_candidate);
    return app;
};
//# sourceMappingURL=examCandidate.js.map