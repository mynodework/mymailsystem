"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _inboxContent = require("../controllers/inboxContent");

var _inboxContent2 = _interopRequireDefault(_inboxContent);

var _auth = require("../middleware/auth");

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {

    /* Route for List of Variable Template */
    app.route("/new/inboxContent/:emailLimit/:page_no").get( /*auth.requiresLogin,*/_inboxContent2.default.inbox);

    return app;
};
//# sourceMappingURL=newInboxApi.js.map