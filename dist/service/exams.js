"use strict";

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _db = require("../db");

var _db2 = _interopRequireDefault(_db);

var _constant = require("../models/constant");

var _constant2 = _interopRequireDefault(_constant);

var _sendSlackNotification = require("../service/sendSlackNotification");

var _sendSlackNotification2 = _interopRequireDefault(_sendSlackNotification);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    saveQuestion: function saveQuestion(examQuestions, body) {
        return new Promise(function (resolve, reject) {
            _db2.default.Tag.findOne({ where: { id: body.job_profile, is_job_profile_tag: 1 } }).then(function (jobProfile) {
                if (jobProfile) {
                    examQuestions.count({ exam_subject: body.exam_subject }).then(function (countQues) {
                        if (countQues < (0, _constant2.default)().addQuesLimit) {
                            examQuestions.findOne({ question: body.question }).then(function (resp) {
                                if (!resp) {
                                    examQuestions.create(body).then(function (result) {
                                        resolve({ status: 1, message: "question added", data: result });
                                    }, function (err) {
                                        reject(err);
                                    });
                                } else {
                                    reject("question already exist");
                                }
                            }, function (err) {
                                reject(err);
                            });
                        } else {
                            reject("can not add more than " + (0, _constant2.default)().addQuesLimit + " questions in this group");
                        }
                    });
                } else {
                    reject("job profile not exist");
                }
            });
        });
    },
    getAllQuestions: function getAllQuestions(examQuestions, job_profile, admin) {
        return new Promise(function (resolve, reject) {
            var questions = [];
            var total_length = 0;
            _db2.default.examSubject.findAll().then(function (examGroups) {
                findQuestionByGroup(examGroups, function (final_response) {
                    resolve({ status: 1, data: final_response, count: total_length });
                });

                function findQuestionByGroup(examGroups, callback) {
                    var group = examGroups.splice(0, 1)[0];
                    var randomQuestions = [];
                    examQuestions.find({ job_profile: { $in: [job_profile] }, exam_subject: group.id }, { "_id": 1, "question": 1, "options": 1, "description": 1 }).then(function (resp) {
                        if (resp.length) {
                            if (!admin) {
                                randomQuestions = _lodash2.default.sampleSize(resp, (0, _constant2.default)().RandomQuesLimit);
                                total_length += randomQuestions.length;
                            } else {
                                total_length += resp.length;
                            }
                            questions.push({ group_name: group.exam_subject, questions: randomQuestions.length ? randomQuestions : resp });
                        }
                        if (examGroups.length) {
                            findQuestionByGroup(examGroups, callback);
                        } else {
                            callback(questions);
                        }
                    }, function (err) {
                        reject(err);
                    });
                }
            });
        });
    },
    updateQuestion: function updateQuestion(examQuestions, body, questionID) {
        return new Promise(function (resolve, reject) {
            examQuestions.update({ _id: questionID }, body).then(function (resp) {
                if (resp) {
                    resolve({ status: 1, mesage: "question updated", data: resp });
                } else {
                    reject("question not found");
                }
            }, function (err) {
                reject(err);
            });
        });
    },
    get_one_question: function get_one_question(examQuestions, questionID) {
        return new Promise(function (resolve, reject) {
            examQuestions.findOne({ _id: questionID }).then(function (resp) {
                if (resp) {
                    resolve({ status: 1, data: resp });
                } else {
                    reject("question not found");
                }
            }, function (err) {
                reject(err);
            });
        });
    },

    deleteQuestion: function deleteQuestion(examQuestions, questionID) {
        return new Promise(function (resolve, reject) {
            examQuestions.remove({ _id: questionID }).then(function (resp) {
                if (resp) {
                    resolve({ status: 1, message: "question deleted" });
                } else {
                    reject("question not found");
                }
            }, function (err) {
                reject(err);
            });
        });
    },

    exam_result: function exam_result(examQuestions, email, candidateResult, body) {
        return new Promise(function (resolve, reject) {
            body.job_profile = parseInt(body.job_profile);
            examQuestions.find({ job_profile: { $in: [body.job_profile] } }, { "_id": 1, "answer": 1 }).then(function (result) {
                var correct_answers = 0;
                _lodash2.default.map(body.answers, function (val, key) {
                    _lodash2.default.filter(result, function (index) {
                        if (index._id == val.Q_id && index.answer == val.ans_id) {
                            correct_answers++;
                        }
                    });
                });
                body.exam_score = correct_answers;
                candidateResult.find({ fb_id: body.fb_id }).then(function (resp) {
                    candidateUpdateResult(function (response) {
                        email.findOne({ fb_id: body.fb_id }).then(function (user) {
                            var slack_message = (0, _constant2.default)().submit_exam_message + "\n" + (0, _constant2.default)().fb_url + body.fb_id + "\n" + "Email: " + user.sender_mail + "\n" + (0, _constant2.default)().candidate_url + user._id;
                            _sendSlackNotification2.default.slackNotification(slack_message, user.sender_mail).then(function (slack_response) {
                                if (slack_response == 200) {
                                    resolve(response);
                                }
                            }, function (err) {
                                reject(err);
                            });
                        });
                    });

                    function candidateUpdateResult(callback) {
                        if (resp.length != 0) {
                            candidateResult.update({ fb_id: body.fb_id }, body).then(function (resp) {
                                email.update({ fb_id: body.fb_id }, { $set: { examScore: correct_answers, exam_date: new Date() } }, { multi: true }).then(function (data) {
                                    if (data) {
                                        callback({ status: 1, message: "answers submitted" });
                                    } else {
                                        reject("user not exist or something went wrong");
                                    }
                                }, function (err) {
                                    reject(err);
                                });
                            }, function (err) {
                                reject(err);
                            });
                        } else {
                            candidateResult.create(body).then(function (response) {
                                if (response) {
                                    email.update({ fb_id: body.fb_id }, { $set: { examScore: correct_answers, exam_date: new Date() } }, { multi: true }).then(function (data) {
                                        if (data) {
                                            callback({ status: 1, message: "answers submitted" });
                                        } else {
                                            reject("user not exist or something went wrong");
                                        }
                                    }, function (err) {
                                        reject(err);
                                    });
                                }
                            }, function (err) {
                                reject(err);
                            });
                        }
                    }
                }, function (err) {
                    reject(err);
                });
            });
        });
    },

    showExamResult: function showExamResult(email, params, body) {
        return new Promise(function (resolve, reject) {
            var where = '';
            if (body.search_type == "email") {
                where = { 'sender_mail': { '$regex': new RegExp(body.user_email, 'i') }, "examScore": { "$exists": true } };
            } else if (body.search_type == "name") {
                where = { 'from': { '$regex': new RegExp(body.name, 'i') }, "examScore": { "$exists": true } };
            } else if (body.search_type == "date") {
                where = { 'exam_date': { $lt: body.end_date, $gte: body.start_date }, "examScore": { "$exists": true } };
            } else {
                where = { "examScore": { "$exists": true } };
            }
            email.find(where, { "from": 1, "sender_mail": 1, "examScore": 1, "exam_date": 1, "fb_id": 1 }).then(function (data) {
                resolve(_lodash2.default.uniqBy(data, 'sender_mail'));
            }, function (err) {
                reject(err);
            });
        });
    },

    verifyOTP: function verifyOTP(body) {
        return new Promise(function (resolve, reject) {
            _db2.default.examCandidate.findOne({ where: { fb_id: body.fb_id, examToken: body.examToken } }).then(function (data) {
                if (data) {
                    resolve({ status: 1, data: data });
                } else {
                    reject({ message: "Invalid OTP" });
                }
            }, function (err) {
                reject(err);
            });
        });
    },

    getJobProfile: function getJobProfile(tag_data) {
        return new Promise(function (resolve, reject) {
            var final_response = [];
            if (tag_data.tag_id.length) {
                findTag(tag_data, function (response) {
                    resolve(response);
                });
            } else {
                resolve({ status: 0, message: "No tag is Assigned Contact with Hr" });
            }

            function findTag(tag, callback) {
                var job_profile = tag.tag_id.splice(0, 1)[0];
                _db2.default.Tag.findOne({ where: { id: parseInt(job_profile) } }).then(function (job_profile_data) {
                    final_response.push(job_profile_data);
                    if (tag.tag_id.length) {
                        findTag(tag, callback);
                    } else {
                        callback(final_response);
                    }
                });
            }
        });
    },

    candidate_exam_result: function candidate_exam_result(examQuestions, candidateResult, body) {
        return new Promise(function (resolve, reject) {
            var finalResult = [];
            examQuestions.find({}, { "_id": 1, "answer": 1, "options": 1, "question": 1, "description": 1 }).then(function (questions) {
                candidateResult.findOne({ fb_id: body.fb_id }).then(function (data) {
                    if (data) {
                        var candidateQuestions = [];
                        _lodash2.default.map(data.questionIds, function (val, key) {
                            _lodash2.default.filter(questions, function (index) {
                                if (index._id == val) {
                                    candidateQuestions.push(index);
                                }
                            });
                        });

                        var candidateAnswers = [];
                        _lodash2.default.map(candidateQuestions, function (val, key) {
                            var check = _lodash2.default.find(data.answers, function (get) {
                                return get.Q_id == val._id;
                            });
                            var candidate_answer_data = {
                                _id: val._id,
                                question: val.question,
                                answer: val.answer,
                                options: val.options,
                                description: val.description
                            };
                            if (check) {
                                candidate_answer_data['candidate_answer'] = check.ans_id;
                                candidateAnswers.push(candidate_answer_data);
                            } else {
                                candidate_answer_data['candidate_answer'] = null;
                                candidateAnswers.push(candidate_answer_data);
                            }
                            if (key == candidateQuestions.length - 1) {
                                var candidate_result = {
                                    questions: candidateAnswers,
                                    totalQuestions: data.questionIds.length,
                                    attempted_questions: data.answers.length,
                                    exam_score: data.exam_score,
                                    wrong_answers: data.answers.length - data.exam_score,
                                    taken_time_minutes: data.taken_time_minutes
                                };
                                resolve({ status: 1, data: candidate_result });
                            }
                        });
                    } else {
                        reject("result not found");
                    }
                });
            });
        });
    },
    approve_candidate: function approve_candidate(email, body) {
        return new Promise(function (resolve, reject) {
            email.findOneAndUpdate({ sender_mail: body.email }, { $set: { candidate_status: true, tag_id: [body.tag_id.toString()] } }).then(function (data) {
                resolve({ status: 1, message: "approved" });
            }, function (err) {
                reject(err);
            });
        });
    }

};
//# sourceMappingURL=exams.js.map