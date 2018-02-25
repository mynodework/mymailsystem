"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sendMail = undefined;

var _BaseAPIController2 = require("./BaseAPIController");

var _BaseAPIController3 = _interopRequireDefault(_BaseAPIController2);

var _send_mail = require("../modules/send_mail");

var _send_mail2 = _interopRequireDefault(_send_mail);

var _constant = require("../models/constant");

var _constant2 = _interopRequireDefault(_constant);

var _emailprocess = require("../mongodb/emailprocess");

var _emailprocess2 = _interopRequireDefault(_emailprocess);

var _emaillogs = require("../service/emaillogs");

var _emaillogs2 = _interopRequireDefault(_emaillogs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sendMail = exports.sendMail = function (_BaseAPIController) {
    _inherits(sendMail, _BaseAPIController);

    function sendMail() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, sendMail);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = sendMail.__proto__ || Object.getPrototypeOf(sendMail)).call.apply(_ref, [this].concat(args))), _this), _this.send_mail = function (req, res, next) {
            _this._db.Smtp.smtp_details().then(function (smtp_info, err) {
                _send_mail2.default.send_mail(req.body.subject, req.body.text, req.body.html, req.body.filename, req.body.content, smtp_info).then(function (response) {
                    _this.handleSuccessResponse(req, res, next, response);
                });
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.updateEmails = function (req, res, next) {
            _send_mail2.default.updateMails(req.email).then(function (response) {
                _this.handleSuccessResponse(req, res, next, response);
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }
    /* Controller for send mail */


    return sendMail;
}(_BaseAPIController3.default);

var sendMails = new sendMail();
exports.default = sendMails;
//# sourceMappingURL=sendMail.js.map