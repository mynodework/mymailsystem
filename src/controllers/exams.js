import BaseAPIController from "./BaseAPIController";
import exam from "../service/exams";
import examProvider from "../providers/examsProvider";


export class exams extends BaseAPIController {
    add_questions = (req, res, next) => {
        req.body.user = req.user.email
        req.body.job_profile = parseInt(req.body.job_profile)
        examProvider.provideQuestions(req.checkBody, req.body, req.getValidationResult())
            .then((body) => {
                exam.saveQuestion(req.examQuestions, body)
                    .then((data) => {
                        this.handleSuccessResponse(req, res, next, data)
                    }, (err) => {
                        this.handleErrorResponse(res, err, next)
                    })
            }).catch(this.handleErrorResponse.bind(null, res));
    }

    get_all_questions = (req, res, next) => {
        var job_profile = parseInt(req.params.job_profile)
        exam.getAllQuestions(req.examQuestions, job_profile, false)
            .then((data) => { this.handleSuccessResponse(req, res, next, data) })
            .catch(this.handleErrorResponse.bind(null, res));
    }

    getQuestionById = (req, res, next) => {
        exam.get_one_question(req.examQuestions, req.params.questionId)
            .then((data) => { this.handleSuccessResponse(req, res, next, data) })
            .catch(this.handleErrorResponse.bind(null, res));
    }

    update_questions = (req, res, next) => {
        exam.updateQuestion(req.examQuestions, req.body, req.params.questionId)
            .then((data) => { this.handleSuccessResponse(req, res, next, data) })
            .catch(this.handleErrorResponse.bind(null, res));
    }

    delete_questions = (req, res, next) => {
        exam.deleteQuestion(req.examQuestions, req.params.questionId)
            .then((data) => { this.handleSuccessResponse(req, res, next, data) })
            .catch(this.handleErrorResponse.bind(null, res));
    }

    getJobprofiles = (req, res, next) => {
        req.email.findOne({ fb_id: req.body.fb_id }, { "tag_id": 1 }).then((tag_data) => {
            exam.getJobProfile(tag_data).then((data) => {
                this.handleSuccessResponse(req, res, next, data)
            })
        }).catch(this.handleErrorResponse.bind(null, res));
    }

    examResult = (req, res, next) => {
        examProvider.provideResult(req.checkBody, req.body, req.getValidationResult())
            .then((body) => {
                exam.exam_result(req.examQuestions, req.email, req.candidateResult, body)
                    .then((data) => {
                        this.handleSuccessResponse(req, res, next, data)
                    }, (err) => {
                        this.handleErrorResponse(res, err, next)
                    })
            }).catch(this.handleErrorResponse.bind(null, res));
    }

    show_exam_result = (req, res, next) => {
        examProvider.provideShowResult(req.checkBody, req.body, req.getValidationResult()).then((body) => {
            exam.showExamResult(req.email, req.params, req.body).then((data) => {
                this.handleSuccessResponse(req, res, next, data)
            }, (err) => {
                this.handleErrorResponse(res, err, next)
            })
        }).catch(this.handleErrorResponse.bind(null, res));
    }

    verify_otp = (req, res, next) => {
        examProvider.ProvideVerifyOTP(req.checkBody, req.body, req.getValidationResult()).then((body) => {
            exam.verifyOTP(body).then((data) => {
                this.handleSuccessResponse(req, res, next, data)
            }, (err) => {
                this.handleErrorResponse(res, err, next)
            })
        }).catch(this.handleErrorResponse.bind(null, res));
    }

    examSubjects = (req, res, next) => {
        examProvider.provideExamSubject(req.checkBody, req.body, req.getValidationResult()).then((body) => {
            this._db.examSubject.exam_subject(body).then((data) => {
                this.handleSuccessResponse(req, res, next, data)
            }, (err) => {
                this.handleErrorResponse(res, err, next)
            })
        }).catch(this.handleErrorResponse.bind(null, res));
    }

    getExamSubjects = (req, res, next) => {
        this._db.examSubject.findAll({ attributes: ['id', 'exam_subject'] }).then((data) => {
            this.handleSuccessResponse(req, res, next, data)
        }).catch(this.handleErrorResponse.bind(null, res));
    }

    getQuestions = (req, res, next) => {
        var job_profile = parseInt(req.params.job_profile)
        exam.getAllQuestions(req.examQuestions, job_profile, true)
            .then((data) => { this.handleSuccessResponse(req, res, next, data) })
            .catch(this.handleErrorResponse.bind(null, res));
    }

    addCandidate = (req, res, next) => {
        examProvider.addNewCandidate(req.checkBody, req.body, req.getValidationResult()).then((body) => {
            req.email.create(body).then((data) => {
                this.handleSuccessResponse(req, res, next, data)
            }, (err) => {
                this.handleErrorResponse(res, err, next)
            })
        }).catch(this.handleErrorResponse.bind(null, res));
    }

    getPendingCandidate = (req, res, next) => {
        req.email.find({ candidate_status: false }, { "candidate_status": 1, "from": 1, "sender_mail": 1, "date": 1, "fb_id": 1 }).then((response) => {
            this.handleSuccessResponse(req, res, next, response)
        }).catch(this.handleErrorResponse.bind(null, res));
    }

    getCandidateResult = (req, res, next) => {
        exam.candidate_exam_result(req.examQuestions, req.candidateResult, req.body).then((data) => {
            this.handleSuccessResponse(req, res, next, data)
        }).catch(this.handleErrorResponse.bind(null, res));
    }

    approveCandidate = (req, res, next) => {
        examProvider.approveCandidate(req.checkBody, req.body, req.getValidationResult()).then((body) => {
            exam.approve_candidate(req.email, body).then((data) => {
                this.handleSuccessResponse(req, res, next, data)
            }, (err) => {
                this.handleErrorResponse(res, err, next)
            })
        }).catch(this.handleErrorResponse.bind(null, res));
    }
}

const controller = new exams();
export default controller;