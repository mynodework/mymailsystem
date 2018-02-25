"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (sequelize, DataTypes) {
    var examCandidate = sequelize.define("examCandidate", {
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        name: {
            type: DataTypes.STRING
        },
        gender: {
            type: DataTypes.STRING
        },
        fb_id: {
            type: DataTypes.BIGINT
        },
        profile_pic: {
            type: DataTypes.STRING
        },
        examScore: {
            type: DataTypes.INTEGER
        },
        examToken: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: true,
        freezeTableName: true,
        allowNull: true,
        classMethods: {
            signup_login: function signup_login(email, body) {
                var _this = this;

                return new Promise(function (resolve, reject) {
                    _examsProvider2.default.randomNumber().then(function (examToken) {
                        body.examToken = examToken;
                        var slack_message = "Candidate name " + body.name + "\n" + " Candidate email: " + body.appliedEmail + "\n" + " Exam Token: " + body.examToken;
                        email.findOne({ sender_mail: body.appliedEmail }).then(function (get_email) {
                            if (get_email) {
                                if (get_email.candidate_status != undefined && !get_email.candidate_status) {
                                    reject({ message: "Contact with Hr To Approve And Assign A Profile" });
                                } else {
                                    email.update({ sender_mail: body.appliedEmail }, { $set: { fb_id: body.fb_id } }, { multi: true }).then(function (resp) {
                                        _this.findOne({ where: { email: body.email } }).then(function (response) {
                                            if (response) {
                                                _this.update(body, { where: { email: body.email } }).then(function (user) {
                                                    if (user) {
                                                        _sendSlackNotification2.default.slackNotification(slack_message, body.appliedEmail).then(function (slack_response) {
                                                            if (slack_response == 200) {
                                                                resolve({
                                                                    status: 1,
                                                                    message: "OTP sent to the HR"
                                                                });
                                                            }
                                                        }, function (err) {
                                                            reject(err);
                                                        });
                                                    } else {
                                                        reject('could not login');
                                                    }
                                                }, function (err) {
                                                    reject(err);
                                                });
                                            } else {
                                                _this.create(body).then(function (user) {
                                                    if (user) {
                                                        _sendSlackNotification2.default.slackNotification(slack_message, body.appliedEmail).then(function (slack_response) {
                                                            if (slack_response == 200) {
                                                                resolve({
                                                                    status: 1,
                                                                    message: "OTP sent to the HR"
                                                                });
                                                            } else {
                                                                reject("could not generate OTP");
                                                            }
                                                        }, function (err) {
                                                            reject(err);
                                                        });
                                                    } else {
                                                        reject('could not login');
                                                    }
                                                }, function (err) {
                                                    reject(err);
                                                });
                                            }
                                        }, function (err) {
                                            reject(err);
                                        });
                                    });
                                }
                            } else {
                                resolve({ status: 0, message: "have you applied with another email?" });
                            }
                        }, function (err) {
                            reject(err);
                        });
                    });
                });
            }
        }
    });
    return examCandidate;
};

var _examsProvider = require("../providers/examsProvider");

var _examsProvider2 = _interopRequireDefault(_examsProvider);

var _sendSlackNotification = require("../service/sendSlackNotification");

var _sendSlackNotification2 = _interopRequireDefault(_sendSlackNotification);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=examCandidate.js.map