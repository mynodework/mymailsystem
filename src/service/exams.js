import _ from "lodash";
import db from "../db";
import constant from "../models/constant";
import slack from '../service/sendSlackNotification';

module.exports = {
    saveQuestion: function(examQuestions, body) {
        return new Promise((resolve, reject) => {
            db.Tag.findOne({ where: { id: body.job_profile, is_job_profile_tag: 1 } }).then((jobProfile) => {
                if (jobProfile) {
                    examQuestions.count({ exam_subject: body.exam_subject }).then((countQues) => {
                        if (countQues < constant().addQuesLimit) {
                            examQuestions.findOne({ question: body.question }).then((resp) => {
                                if (!resp) {
                                    examQuestions.create(body).then((result) => {
                                        resolve({ status: 1, message: "question added", data: result });
                                    }, (err) => { reject(err) })
                                } else {
                                    reject("question already exist")
                                }
                            }, (err) => { reject(err) })
                        } else {
                            reject(`can not add more than ${constant().addQuesLimit} questions in this group`)
                        }
                    })
                } else {
                    reject("job profile not exist")
                }
            })
        })
    },
    getAllQuestions: function(examQuestions, job_profile, admin) {
        return new Promise((resolve, reject) => {
            let questions = [];
            let total_length = 0;
            db.examSubject.findAll().then((examGroups) => {
                findQuestionByGroup(examGroups, function(final_response) {
                    resolve({ status: 1, data: final_response, count: total_length })
                })

                function findQuestionByGroup(examGroups, callback) {
                    let group = examGroups.splice(0, 1)[0];
                    let randomQuestions = []
                    examQuestions.find({ job_profile: { $in: [job_profile] }, exam_subject: group.id }, { "_id": 1, "question": 1, "options": 1, "description": 1 }).then((resp) => {
                        if (resp.length) {
                            if (!admin) {
                                randomQuestions = _.sampleSize(resp, constant().RandomQuesLimit);
                                total_length += randomQuestions.length
                            } else {
                                total_length += resp.length
                            }
                            questions.push({ group_name: group.exam_subject, questions: randomQuestions.length ? randomQuestions : resp })
                        }
                        if (examGroups.length) {
                            findQuestionByGroup(examGroups, callback)
                        } else {
                            callback(questions)
                        }
                    }, (err) => { reject(err) })
                }
            })
        })
    },
    updateQuestion: function(examQuestions, body, questionID) {
        return new Promise((resolve, reject) => {
            examQuestions.update({ _id: questionID }, body).then((resp) => {
                if (resp) {
                    resolve({ status: 1, mesage: "question updated", data: resp })
                } else {
                    reject("question not found")
                }
            }, (err) => { reject(err) })
        })
    },
    get_one_question: function(examQuestions, questionID) {
        return new Promise((resolve, reject) => {
            examQuestions.findOne({ _id: questionID }).then((resp) => {
                if (resp) {
                    resolve({ status: 1, data: resp })
                } else {
                    reject("question not found")
                }
            }, (err) => { reject(err) })
        })
    },

    deleteQuestion: function(examQuestions, questionID) {
        return new Promise((resolve, reject) => {
            examQuestions.remove({ _id: questionID }).then((resp) => {
                if (resp) {
                    resolve({ status: 1, message: "question deleted" })
                } else {
                    reject("question not found")
                }
            }, (err) => { reject(err) })
        })
    },

    exam_result: function(examQuestions, email, candidateResult, body) {
        return new Promise((resolve, reject) => {
            body.job_profile = parseInt(body.job_profile)
            examQuestions.find({ job_profile: { $in: [body.job_profile] } }, { "_id": 1, "answer": 1 }).then((result) => {
                let correct_answers = 0;
                _.map(body.answers, (val, key) => {
                    _.filter(result, function(index) {
                        if ((index._id == val.Q_id) && (index.answer == val.ans_id)) {
                            correct_answers++;
                        }
                    });
                });
                body.exam_score = correct_answers;
                candidateResult.find({ fb_id: body.fb_id }).then((resp) => {
                    candidateUpdateResult(function(response) {
                        email.findOne({ fb_id: body.fb_id }).then((user) => {
                            let slack_message = constant().submit_exam_message + "\n" + constant().fb_url + body.fb_id + "\n" + "Email: " + user.sender_mail + "\n" + constant().candidate_url + user._id;
                            slack.slackNotification(slack_message, user.sender_mail).then((slack_response) => {
                                if (slack_response == 200) {
                                    resolve(response)
                                }
                            }, (err) => { reject(err) })
                        })
                    })

                    function candidateUpdateResult(callback) {
                        if (resp.length != 0) {
                            candidateResult.update({ fb_id: body.fb_id }, body).then((resp) => {
                                email.update({ fb_id: body.fb_id }, { $set: { examScore: correct_answers, exam_date: new Date() } }, { multi: true }).then((data) => {
                                    if (data) {
                                        callback({ status: 1, message: "answers submitted" })
                                    } else {
                                        reject("user not exist or something went wrong")
                                    }
                                }, (err) => { reject(err) })
                            }, (err) => { reject(err) })
                        } else {
                            candidateResult.create(body).then((response) => {
                                if (response) {
                                    email.update({ fb_id: body.fb_id }, { $set: { examScore: correct_answers, exam_date: new Date() } }, { multi: true }).then((data) => {
                                        if (data) {
                                            callback({ status: 1, message: "answers submitted" })
                                        } else {
                                            reject("user not exist or something went wrong")
                                        }
                                    }, (err) => { reject(err) })
                                }
                            }, (err) => { reject(err) })
                        }
                    }
                }, (err) => { reject(err) })
            })
        })
    },

    showExamResult: function(email, params, body) {
        return new Promise((resolve, reject) => {
            let where = '';
            if (body.search_type == "email") {
                where = { 'sender_mail': { '$regex': new RegExp(body.user_email, 'i') }, "examScore": { "$exists": true } }
            } else if (body.search_type == "name") {
                where = { 'from': { '$regex': new RegExp(body.name, 'i') }, "examScore": { "$exists": true } }
            } else if (body.search_type == "date") {
                where = { 'exam_date': { $lt: body.end_date, $gte: body.start_date }, "examScore": { "$exists": true } }
            } else {
                where = { "examScore": { "$exists": true } }
            }
            email.find(where, { "from": 1, "sender_mail": 1, "examScore": 1, "exam_date": 1, "fb_id": 1 }).then((data) => {
                resolve(_.uniqBy(data, 'sender_mail'))
            }, (err) => { reject(err) })
        })
    },

    verifyOTP: function(body) {
        return new Promise((resolve, reject) => {
            db.examCandidate.findOne({ where: { fb_id: body.fb_id, examToken: body.examToken } }).then((data) => {
                if (data) {
                    resolve({ status: 1, data: data })
                } else {
                    reject({ message: "Invalid OTP" })
                }
            }, (err) => { reject(err) })
        })
    },

    getJobProfile: (tag_data) => {
        return new Promise((resolve, reject) => {
            let final_response = [];
            if (tag_data.tag_id.length) {
                findTag(tag_data, function(response) {
                    resolve(response)
                })
            } else {
                resolve({ status: 0, message: "No tag is Assigned Contact with Hr" })
            }

            function findTag(tag, callback) {
                let job_profile = tag.tag_id.splice(0, 1)[0];
                db.Tag.findOne({ where: { id: parseInt(job_profile) } }).then((job_profile_data) => {
                    final_response.push(job_profile_data)
                    if (tag.tag_id.length) {
                        findTag(tag, callback)
                    } else {
                        callback(final_response)
                    }
                })
            }
        });
    },

    candidate_exam_result: function(examQuestions, candidateResult, body) {
        return new Promise((resolve, reject) => {
            let finalResult = []
            examQuestions.find({}, { "_id": 1, "answer": 1, "options": 1, "question": 1, "description": 1 }).then((questions) => {
                candidateResult.findOne({ fb_id: body.fb_id }).then((data) => {
                    if (data) {
                        let candidateQuestions = []
                        _.map(data.questionIds, (val, key) => {
                            _.filter(questions, function(index) {
                                if (index._id == val) {
                                    candidateQuestions.push(index);
                                }
                            });
                        });

                        let candidateAnswers = []
                        _.map(candidateQuestions, (val, key) => {
                            let check = _.find(data.answers, function(get) { return get.Q_id == val._id; });
                            let candidate_answer_data = {
                                _id: val._id,
                                question: val.question,
                                answer: val.answer,
                                options: val.options,
                                description: val.description
                            }
                            if (check) {
                                candidate_answer_data['candidate_answer'] = check.ans_id;
                                candidateAnswers.push(candidate_answer_data)
                            } else {
                                candidate_answer_data['candidate_answer'] = null;
                                candidateAnswers.push(candidate_answer_data)
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
                                resolve({ status: 1, data: candidate_result })
                            }
                        });
                    } else {
                        reject("result not found")
                    }
                })
            })
        })
    },
    approve_candidate: function(email, body) {
        return new Promise((resolve, reject) => {
            email.findOneAndUpdate({ sender_mail: body.email }, { $set: { candidate_status: true, tag_id: [body.tag_id.toString()] } }).then((data) => {
                resolve({ status: 1, message: "approved" })
            }, (err) => { reject(err) })
        })
    }

}