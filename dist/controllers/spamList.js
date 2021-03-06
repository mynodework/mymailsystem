"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.VariableController = undefined;

var _BaseAPIController2 = require("./BaseAPIController");

var _BaseAPIController3 = _interopRequireDefault(_BaseAPIController2);

var _SpamListProvider = require("../providers/SpamListProvider.js");

var _SpamListProvider2 = _interopRequireDefault(_SpamListProvider);

var _spamWork = require("../service/spamWork");

var _spamWork2 = _interopRequireDefault(_spamWork);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VariableController = exports.VariableController = function (_BaseAPIController) {
    _inherits(VariableController, _BaseAPIController);

    function VariableController() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, VariableController);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = VariableController.__proto__ || Object.getPrototypeOf(VariableController)).call.apply(_ref, [this].concat(args))), _this), _this.create = function (req, res, next) {
            _SpamListProvider2.default.save(_this._db, req.checkBody, req.body, req.getValidationResult()).then(function (spamData) {
                _this._db.SpamList.create(spamData).then(function (data) {
                    return _this.handleSuccessResponse(req, res, next, data);
                }).catch(_this.handleErrorResponse.bind(null, res));
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.update = function (req, res, next) {
            _SpamListProvider2.default.save(_this._db, req.checkBody, req.body, req.getValidationResult()).then(function (data) {
                _this._db.SpamList.update(data, {
                    where: {
                        id: req.params.spamListId
                    }
                }).then(function (docs) {
                    _this.handleSuccessResponse(req, res, next, { status: "SUCCESS" });
                });
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.deletespamList = function (req, res, next) {
            _this._db.SpamList.destroy({
                where: {
                    id: req.params.spamListId
                }
            }).then(function (docs) {
                _this.handleSuccessResponse(req, res, next, { status: "SUCCESS" });
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.spamList = function (req, res, next) {
            _this._db.SpamList.findAll({
                offset: (req.params.page - 1) * parseInt(req.params.limit),
                limit: parseInt(req.params.limit),
                order: '`id` DESC'
            }).then(function (data) {
                return _this.handleSuccessResponse(req, res, next, data);
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.idResult = function (req, res, next, spamListId) {
            _this.getById(req, res, _this._db.SpamList, spamListId, next);
        }, _this.getspamListById = function (req, res, next) {
            _this._db.SpamList.findById(parseInt(req.params.spamListId)).then(function (response) {
                _this.handleSuccessResponse(req, res, next, response);
            });
        }, _this.removeSpam = function (req, res, next) {
            _spamWork2.default.removeSpam(req, _this._db).then(function (data) {
                // req.email.remove({_id:{$in:}})
                _this.handleSuccessResponse(req, res, next, data);
            }).catch(_this.handleErrorResponse.bind(null, res));
        }, _this.spamCandidate = function (req, res, next) {
            req.email.find({ sender_mail: req.params.email }).then(function (spamEmails) {
                req.spamBox.insertMany(spamEmails).then(function (movedToSpam) {
                    req.email.find({ sender_mail: req.params.email }).remove().then(function (response) {
                        _this._db.SpamList.create({ email: req.params.email }).then(function (spamEmailAdded) {
                            _this.handleSuccessResponse(req, res, next, { status: "SUCCESS" });
                        });
                    });
                });
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    /* Controller for deletespamList create  */


    /* deletespamList Update */


    /* deletespamList delete */


    /* Get List of All Templates */


    /* Get Variable data using id*/


    /*remove spam from job profiile*/

    return VariableController;
}(_BaseAPIController3.default);

var controller = new VariableController();
exports.default = controller;
//# sourceMappingURL=spamList.js.map