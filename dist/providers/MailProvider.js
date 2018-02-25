"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BaseProvider = require("./BaseProvider");

var BaseProvider = _interopRequireWildcard(_BaseProvider);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var changeUnreadStatus = function changeUnreadStatus(validate, body, validationResult) {
    return new Promise(function (resolve, reject) {
        validate("mongo_id", "mongo_id cannot be empty").notEmpty();
        validationResult.then(function (result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
            } else {
                resolve(body);
            }
        });
    });
};

var deleteEmail = function deleteEmail(validate, body, validationResult) {
    return new Promise(function (resolve, reject) {
        validate("mongo_id", "mongo_id cannot be empty").notEmpty();
        validationResult.then(function (result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
            } else {
                resolve(body);
            }
        });
    });
};

var addNewCandidate = function addNewCandidate(validate, body, validationResult) {
    return new Promise(function (resolve, reject) {
        validate("subject", "subject cannot be empty").notEmpty();
        validate("sender_mail", "'must be an email'").notEmpty().isEmail();
        validate("mobile_no", "mobile_no cannot be empty").notEmpty();
        validate("tag_id", "tag id cannot be empty").notEmpty();
        validate("default_tag", "default_tag cannot be empty").notEmpty();
        validate("source", "source cannot be empty").notEmpty();
        validate("from", "candidate name cannot be empty").notEmpty();
        validationResult.then(function (result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
            } else {
                body['unread'] = false;
                body['tag_id'] = [body.tag_id.toString()];
                body['date'] = new Date();
                body['email_date'] = body.date;
                body['is_automatic_email_send'] = false;
                body['attachment'] = [];
                body['default_tag'] = body.default_tag > 0 ? body.default_tag.toString() : "";
                body['from'] = body.from;
                resolve(body);
            }
        });
    });
};

exports.default = {
    BaseProvider: BaseProvider,
    changeUnreadStatus: changeUnreadStatus,
    deleteEmail: deleteEmail,
    addNewCandidate: addNewCandidate
};
//# sourceMappingURL=MailProvider.js.map