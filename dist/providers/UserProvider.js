"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _BaseProvider = require("./BaseProvider");

var BaseProvider = _interopRequireWildcard(_BaseProvider);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Provider for User Registration */
var create = function create(model, validate, body, validationResult) {
    return new Promise(function (resolve, reject) {
        validate("email", "email cannot be empty").notEmpty();
        validate("user_type", "user_type cannot be empty").notEmpty();
        validate("password", "password cannot be empty").notEmpty();
        validate("confirm_password", "confirm_password cannot be empty").notEmpty();
        validationResult.then(function (result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
                return;
            } else {
                if (body.password == body.confirm_password) {
                    delete body.confirm_password;
                    body.password = _crypto2.default.createHash("sha256").update(body.password).digest("base64");
                    resolve(body);
                } else {
                    reject("Password Not Matched");
                }
            }
        });
    });
};

/* Provider for User login */
var login = function login(model, body) {
    var password = _crypto2.default.createHash("sha256").update(body.password).digest("base64");
    delete body.confirm_password;
    return _extends({}, body, {
        password: password
    });
};

var validateParam = function validateParam(params) {
    return new Promise(function (resolve, reject) {
        if (params.emailLimit <= 100) {
            resolve(params);
        } else {
            reject("Maximum 100 records allowed only!!");
        }
    });
};

/* Provider for fb login for exam candidate*/
var fb_login = function fb_login(validate, body, validationResult) {
    return new Promise(function (resolve, reject) {
        validate("name", "name cannot be empty").notEmpty();
        validate("email", "email cannot be empty").notEmpty();
        validate("email", "email is not valid").isEmail();
        validate("gender", "gender cannot be empty").notEmpty();
        validate("fb_id", "fb_id cannot be empty").notEmpty();
        validate("profile_pic", "profile_pic cannot be empty").notEmpty();
        validate("appliedEmail", "appliedEmail cannot be empty").notEmpty();
        validate("appliedEmail", "appliedEmail is not valid").isEmail();
        validationResult.then(function (result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
                return;
            } else {
                resolve(body);
            }
        });
    });
};

exports.default = _extends({}, BaseProvider, {
    create: create,
    login: login,
    validateParam: validateParam,
    fb_login: fb_login
});
//# sourceMappingURL=UserProvider.js.map