import * as BaseProvider from "./BaseProvider";
import util from "util";
import constant from "../models/constant";
import _ from "lodash";

/* Provider for exam questions */
const provideQuestions = (validate, body, validationResult) => new Promise((resolve, reject) => {
    validate("question", "question cannot be empty").notEmpty();
    validate("options", "options cannot be empty").notEmpty();
    validate("job_profile", "job_profile cannot be empty").notEmpty();
    validate("answer", "answer cannot be empty").notEmpty();
    validate("exam_subject", "exam_subject cannot be empty").notEmpty();
    validationResult.then((result) => {
        if (!result.isEmpty()) {
            reject(result.array()[0].msg);
        } else {
            if (_.find(body.options, function(index) { return index.opt_id === body.answer; })) {
                resolve(body)
            } else {
                reject("options doesn't contains answer")
            }
        }
    });
});

const provideResult = (validate, body, validationResult) => new Promise((resolve, reject) => {
    validate("fb_id", "fb_id cannot be empty").notEmpty();
    validate("job_profile", "job_profile cannot be empty").notEmpty();
    validate("answers", "answers cannot be empty").notEmpty();
    validate("questionIds", "questionIds cannot be empty").notEmpty();
    validate("taken_time_minutes", "taken_time_minutes cannot be empty").notEmpty();

    validationResult.then((result) => {
        if (!result.isEmpty()) {
            reject(result.array()[0].msg);
        } else {
            resolve(body)
        }
    });
});

const provideShowResult = (validate, body, validationResult) => new Promise((resolve, reject) => {
    if (body.search_type == "email") {
        validate("user_email", "user_email cannot be empty").notEmpty();
    } else if (body.search_type == "name") {
        validate("name", "name cannot be empty").notEmpty();
    } else if (body.search_type == "date") {
        validate("start_date", "start_date cannot be empty").notEmpty();
        validate("end_date", "end_date cannot be empty").notEmpty();
    }
    validationResult.then((result) => {
        if (!result.isEmpty()) {
            reject(result.array()[0].msg);
        } else {
            resolve(body)
        }
    });
});

const randomNumber = () => new Promise((resolve, reject) => {
    let number = Math.floor((Math.random() * constant().examTokenLimit));
    resolve(number)
});

const ProvideVerifyOTP = (validate, body, validationResult) => new Promise((resolve, reject) => {
    validate("fb_id", "fb_id cannot be empty").notEmpty();
    validate("examToken", "examToken cannot be empty").notEmpty();
    validationResult.then((result) => {
        if (!result.isEmpty()) {
            reject(result.array()[0].msg);
        } else {
            resolve(body)
        }
    });
});

const provideExamSubject = (validate, body, validationResult) => new Promise((resolve, reject) => {
    validate("exam_subject", "exam_subject cannot be empty").notEmpty();
    validationResult.then((result) => {
        if (!result.isEmpty()) {
            reject(result.array()[0].msg);
        } else {
            resolve(body)
        }
    });
});

const addNewCandidate = (validate, body, validationResult) => {
    return new Promise((resolve, reject) => {
        validate("sender_mail", "'must be an email'").notEmpty().isEmail();
        validate("mobile_no", "mobile_no cannot be empty").notEmpty();
        validate("source", "source cannot be empty").notEmpty();
        validate("from", "candidate name cannot be empty").notEmpty();
        validate("fb_id", "facebook id is required").notEmpty();
        validationResult.then(function(result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
            } else {
                body['subject'] = constant().subjectForWalkin
                body['unread'] = false
                body['tag_id'] = []
                body['date'] = new Date();
                body['email_date'] = body.date
                body['is_automatic_email_send'] = false;
                body['attachment'] = [];
                body['default_tag'] = "";
                body['from'] = body.from;
                body['candidate_status'] = false;
                body['body'] = '....';
                resolve(body);
            }
        });
    });
};

const approveCandidate = (validate, body, validationResult) => {
    return new Promise((resolve, reject) => {
        validate("email", "there must be an email").notEmpty().isEmail();
        validate("tag_id", "tag_id cannot be empty").notEmpty();
        validationResult.then(function(result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
            } else {
                resolve(body)
            }
        })
    })
};

export default {
    BaseProvider,
    provideQuestions,
    provideResult,
    provideShowResult,
    randomNumber,
    ProvideVerifyOTP,
    provideExamSubject,
    addNewCandidate,
    approveCandidate
};