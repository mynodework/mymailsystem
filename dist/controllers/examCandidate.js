"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.examCandidateController = undefined;

var _UserProvider = require("../providers/UserProvider.js");

var _UserProvider2 = _interopRequireDefault(_UserProvider);

var _BaseAPIController2 = require("./BaseAPIController");

var _BaseAPIController3 = _interopRequireDefault(_BaseAPIController2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var examCandidateController = exports.examCandidateController = function (_BaseAPIController) {
    _inherits(examCandidateController, _BaseAPIController);

    function examCandidateController() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, examCandidateController);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = examCandidateController.__proto__ || Object.getPrototypeOf(examCandidateController)).call.apply(_ref, [this].concat(args))), _this), _this.exam_candidate = function (req, res, next) {
            _UserProvider2.default.fb_login(req.checkBody, req.body, req.getValidationResult()).then(function (user) {
                _this._db.examCandidate.signup_login(req.email, user).then(function (data) {
                    _this.handleSuccessResponse(req, res, next, data);
                }).catch(_this.handleErrorResponse.bind(null, res));
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }
    /* Controller for online exam candidate */


    return examCandidateController;
}(_BaseAPIController3.default);

var controller = new examCandidateController();
exports.default = controller;
//# sourceMappingURL=examCandidate.js.map