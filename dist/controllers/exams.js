"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.exams = undefined;

var _BaseAPIController2 = require("./BaseAPIController");

var _BaseAPIController3 = _interopRequireDefault(_BaseAPIController2);

var _exams = require("../service/exams");

var _exams2 = _interopRequireDefault(_exams);

var _examsProvider = require("../providers/examsProvider");

var _examsProvider2 = _interopRequireDefault(_examsProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var exams = exports.exams = function (_BaseAPIController) {
    _inherits(exams, _BaseAPIController);

    function exams() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, exams);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = exams.__proto__ || Object.getPrototypeOf(exams)).call.apply(_ref, [this].concat(args))), _this), _this.add_questions = function (req, res, next) {
            req.body.user = req.user.email;
            req.body.job_profile = parseInt(req.body.job_profile);
            _examsProvider2.default.provideQuestions(req.checkBody, req.body, req.getValidationResult()).then(function (body) {
                _exams2.default.saveQuestion(req.examQuestions, body).then(function (data) {
                    _this.handleSuccessResponse(req, res, next, data);
                }, function (err) {
                    _this.handleErrorResponse(res, err, next);
                });
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.get_all_questions = function (req, res, next) {
            var job_profile = parseInt(req.params.job_profile);
            _exams2.default.getAllQuestions(req.examQuestions, job_profile, false).then(function (data) {
                _this.handleSuccessResponse(req, res, next, data);
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.getQuestionById = function (req, res, next) {
            _exams2.default.get_one_question(req.examQuestions, req.params.questionId).then(function (data) {
                _this.handleSuccessResponse(req, res, next, data);
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.update_questions = function (req, res, next) {
            _exams2.default.updateQuestion(req.examQuestions, req.body, req.params.questionId).then(function (data) {
                _this.handleSuccessResponse(req, res, next, data);
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.delete_questions = function (req, res, next) {
            _exams2.default.deleteQuestion(req.examQuestions, req.params.questionId).then(function (data) {
                _this.handleSuccessResponse(req, res, next, data);
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.getJobprofiles = function (req, res, next) {
            req.email.findOne({ fb_id: req.body.fb_id }, { "tag_id": 1 }).then(function (tag_data) {
                _exams2.default.getJobProfile(tag_data).then(function (data) {
                    _this.handleSuccessResponse(req, res, next, data);
                });
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.examResult = function (req, res, next) {
            _examsProvider2.default.provideResult(req.checkBody, req.body, req.getValidationResult()).then(function (body) {
                _exams2.default.exam_result(req.examQuestions, req.email, req.candidateResult, body).then(function (data) {
                    _this.handleSuccessResponse(req, res, next, data);
                }, function (err) {
                    _this.handleErrorResponse(res, err, next);
                });
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.show_exam_result = function (req, res, next) {
            _examsProvider2.default.provideShowResult(req.checkBody, req.body, req.getValidationResult()).then(function (body) {
                _exams2.default.showExamResult(req.email, req.params, req.body).then(function (data) {
                    _this.handleSuccessResponse(req, res, next, data);
                }, function (err) {
                    _this.handleErrorResponse(res, err, next);
                });
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.verify_otp = function (req, res, next) {
            _examsProvider2.default.ProvideVerifyOTP(req.checkBody, req.body, req.getValidationResult()).then(function (body) {
                _exams2.default.verifyOTP(body).then(function (data) {
                    _this.handleSuccessResponse(req, res, next, data);
                }, function (err) {
                    _this.handleErrorResponse(res, err, next);
                });
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.examSubjects = function (req, res, next) {
            _examsProvider2.default.provideExamSubject(req.checkBody, req.body, req.getValidationResult()).then(function (body) {
                _this._db.examSubject.exam_subject(body).then(function (data) {
                    _this.handleSuccessResponse(req, res, next, data);
                }, function (err) {
                    _this.handleErrorResponse(res, err, next);
                });
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.getExamSubjects = function (req, res, next) {
            _this._db.examSubject.findAll({ attributes: ['id', 'exam_subject'] }).then(function (data) {
                _this.handleSuccessResponse(req, res, next, data);
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.getQuestions = function (req, res, next) {
            var job_profile = parseInt(req.params.job_profile);
            _exams2.default.getAllQuestions(req.examQuestions, job_profile, true).then(function (data) {
                _this.handleSuccessResponse(req, res, next, data);
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.addCandidate = function (req, res, next) {
            _examsProvider2.default.addNewCandidate(req.checkBody, req.body, req.getValidationResult()).then(function (body) {
                req.email.create(body).then(function (data) {
                    _this.handleSuccessResponse(req, res, next, data);
                }, function (err) {
                    _this.handleErrorResponse(res, err, next);
                });
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.getPendingCandidate = function (req, res, next) {
            req.email.find({ candidate_status: false }, { "candidate_status": 1, "from": 1, "sender_mail": 1, "date": 1, "fb_id": 1 }).then(function (response) {
                _this.handleSuccessResponse(req, res, next, response);
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.getCandidateResult = function (req, res, next) {
            _exams2.default.candidate_exam_result(req.examQuestions, req.candidateResult, req.body).then(function (data) {
                _this.handleSuccessResponse(req, res, next, data);
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.approveCandidate = function (req, res, next) {
            _examsProvider2.default.approveCandidate(req.checkBody, req.body, req.getValidationResult()).then(function (body) {
                _exams2.default.approve_candidate(req.email, body).then(function (data) {
                    _this.handleSuccessResponse(req, res, next, data);
                }, function (err) {
                    _this.handleErrorResponse(res, err, next);
                });
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return exams;
}(_BaseAPIController3.default);

var controller = new exams();
exports.default = controller;
//# sourceMappingURL=exams.js.map