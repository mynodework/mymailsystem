"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (sequelize, DataTypes) {
    var examSubject = sequelize.define("examSubjects", {
        exam_subject: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: true,
        freezeTableName: true,
        allowNull: true,
        classMethods: {
            exam_subject: function exam_subject(body) {
                var _this = this;

                return new Promise(function (resolve, reject) {
                    _this.findOne({ where: { exam_subject: body.exam_subject } }).then(function (response) {
                        if (!response) {
                            _this.create(body).then(function (user) {
                                resolve(user);
                            }, function (err) {
                                reject(err);
                            });
                        } else {
                            reject("subject already exist");
                        }
                    }, function (err) {
                        reject(err);
                    });
                });
            }
        }
    });
    return examSubject;
};

var _examsProvider = require("../providers/examsProvider");

var _examsProvider2 = _interopRequireDefault(_examsProvider);

var _sendSlackNotification = require("../service/sendSlackNotification");

var _sendSlackNotification2 = _interopRequireDefault(_sendSlackNotification);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=examSubject.js.map