"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.inboxContent = undefined;

var _BaseAPIController2 = require("./BaseAPIController");

var _BaseAPIController3 = _interopRequireDefault(_BaseAPIController2);

var _UserProvider = require("../providers/UserProvider.js");

var _UserProvider2 = _interopRequireDefault(_UserProvider);

var _constant = require("../models/constant");

var _constant2 = _interopRequireDefault(_constant);

var _emailprocess = require("../mongodb/emailprocess");

var _emailprocess2 = _interopRequireDefault(_emailprocess);

var _db = require("../db");

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var inboxContent = exports.inboxContent = function (_BaseAPIController) {
    _inherits(inboxContent, _BaseAPIController);

    function inboxContent() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, inboxContent);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = inboxContent.__proto__ || Object.getPrototypeOf(inboxContent)).call.apply(_ref, [this].concat(args))), _this), _this.inbox = function (req, res, next) {
            var response = [];
            _UserProvider2.default.validateParam(req.params).then(function (params) {
                var page = parseInt(params.page_no) - 1;
                req.email.find({}, { "_id": 1, "date": 1, "email_date": 1, "uid": 1, "is_automatic_email_send": 1, "from": 1, "sender_mail": 1, "subject": 1, "unread": 1, "attachment": 1, "tag_id": 1, "is_attachment": 1, "default_tag": 1, "mobile_no": 1, "notes": 1 }, { sort: { date: -1 } }).skip(page * params.emailLimit).limit(parseInt(params.emailLimit)).then(function (fetched) {
                    response.push({ emailFetch: fetched });
                    _db2.default.Tag.findAll().then(function (data) {
                        response.push({ Tag: data });
                        console.log(response);
                        _this.handleSuccessResponse(req, res, next, response);
                    }, function (err) {
                        _this.handleErrorResponse(null, err);
                    });
                }, function (err) {
                    _this.handleErrorResponse(null, err);
                });
            }, function (err) {
                _this.handleErrorResponse(null, err);
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    /* Controller for new  Inbox content  */


    return inboxContent;
}(_BaseAPIController3.default);

var inboxContents = new inboxContent();
exports.default = inboxContents;
//# sourceMappingURL=inboxContent.js.map