"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _BaseProvider = require("./BaseProvider");

var BaseProvider = _interopRequireWildcard(_BaseProvider);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _constant = require("../models/constant");

var _constant2 = _interopRequireDefault(_constant);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* Provider for exam questions */
var provideQuestions = function provideQuestions(validate, body, validationResult) {
    return new Promise(function (resolve, reject) {
        validate("question", "question cannot be empty").notEmpty();
        validate("options", "options cannot be empty").notEmpty();
        validate("job_profile", "job_profile cannot be empty").notEmpty();
        validate("answer", "answer cannot be empty").notEmpty();
        validate("exam_subject", "exam_subject cannot be empty").notEmpty();
        validationResult.then(function (result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
            } else {
                if (_lodash2.default.find(body.options, function (index) {
                    return index.opt_id === body.answer;
                })) {
                    resolve(body);
                } else {
                    reject("options doesn't contains answer");
                }
            }
        });
    });
};

var provideResult = function provideResult(validate, body, validationResult) {
    return new Promise(function (resolve, reject) {
        validate("fb_id", "fb_id cannot be empty").notEmpty();
        validate("job_profile", "job_profile cannot be empty").notEmpty();
        validate("answers", "answers cannot be empty").notEmpty();
        validate("questionIds", "questionIds cannot be empty").notEmpty();
        validate("taken_time_minutes", "taken_time_minutes cannot be empty").notEmpty();

        validationResult.then(function (result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
            } else {
                resolve(body);
            }
        });
    });
};

var provideShowResult = function provideShowResult(validate, body, validationResult) {
    return new Promise(function (resolve, reject) {
        if (body.search_type == "email") {
            validate("user_email", "user_email cannot be empty").notEmpty();
        } else if (body.search_type == "name") {
            validate("name", "name cannot be empty").notEmpty();
        } else if (body.search_type == "date") {
            validate("start_date", "start_date cannot be empty").notEmpty();
            validate("end_date", "end_date cannot be empty").notEmpty();
        }
        validationResult.then(function (result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
            } else {
                resolve(body);
            }
        });
    });
};

var randomNumber = function randomNumber() {
    return new Promise(function (resolve, reject) {
        var number = Math.floor(Math.random() * (0, _constant2.default)().examTokenLimit);
        resolve(number);
    });
};

var ProvideVerifyOTP = function ProvideVerifyOTP(validate, body, validationResult) {
    return new Promise(function (resolve, reject) {
        validate("fb_id", "fb_id cannot be empty").notEmpty();
        validate("examToken", "examToken cannot be empty").notEmpty();
        validationResult.then(function (result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
            } else {
                resolve(body);
            }
        });
    });
};

var provideExamSubject = function provideExamSubject(validate, body, validationResult) {
    return new Promise(function (resolve, reject) {
        validate("exam_subject", "exam_subject cannot be empty").notEmpty();
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
        validate("sender_mail", "'must be an email'").notEmpty().isEmail();
        validate("mobile_no", "mobile_no cannot be empty").notEmpty();
        validate("source", "source cannot be empty").notEmpty();
        validate("from", "candidate name cannot be empty").notEmpty();
        validate("fb_id", "facebook id is required").notEmpty();
        validationResult.then(function (result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
            } else {
                body['subject'] = (0, _constant2.default)().subjectForWalkin;
                body['unread'] = false;
                body['tag_id'] = [];
                body['date'] = new Date();
                body['email_date'] = body.date;
                body['is_automatic_email_send'] = false;
                body['attachment'] = [];
                body['default_tag'] = "";
                body['from'] = body.from;
                body['candidate_status'] = false;
                body['body'] = '....';
                resolve(body);
            }
        });
    });
};

var approveCandidate = function approveCandidate(validate, body, validationResult) {
    return new Promise(function (resolve, reject) {
        validate("email", "there must be an email").notEmpty().isEmail();
        validate("tag_id", "tag_id cannot be empty").notEmpty();
        validationResult.then(function (result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
            } else {
                resolve(body);
            }
        });
    });
};

exports.default = {
    BaseProvider: BaseProvider,
    provideQuestions: provideQuestions,
    provideResult: provideResult,
    provideShowResult: provideShowResult,
    randomNumber: randomNumber,
    ProvideVerifyOTP: ProvideVerifyOTP,
    provideExamSubject: provideExamSubject,
    addNewCandidate: addNewCandidate,
    approveCandidate: approveCandidate
};
//# sourceMappingURL=examsProvider.js.map