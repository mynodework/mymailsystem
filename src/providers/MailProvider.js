import * as BaseProvider from "./BaseProvider";
import util from "util";

const changeUnreadStatus = (validate, body, validationResult) => {
    return new Promise((resolve, reject) => {
        validate("mongo_id", "mongo_id cannot be empty").notEmpty();
        validationResult.then(function(result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
            } else {
                resolve(body);
            }
        });
    });
};

const deleteEmail = (validate, body, validationResult) => {
    return new Promise((resolve, reject) => {
        validate("mongo_id", "mongo_id cannot be empty").notEmpty();
        validationResult.then(function(result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
            } else {
                resolve(body);
            }
        });
    });
};

const addNewCandidate = (validate, body, validationResult) => {
    return new Promise((resolve, reject) => {
        validate("subject", "subject cannot be empty").notEmpty();
        validate("sender_mail", "'must be an email'").notEmpty().isEmail();
        validate("mobile_no", "mobile_no cannot be empty").notEmpty();
        validate("tag_id", "tag id cannot be empty").notEmpty();
        validate("default_tag", "default_tag cannot be empty").notEmpty();
        validate("source", "source cannot be empty").notEmpty();
        validate("from", "candidate name cannot be empty").notEmpty();
        validationResult.then(function(result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
            } else {
                body['unread'] = false
                body['tag_id'] = [body.tag_id.toString()]
                body['date'] = new Date();
                body['email_date'] = body.date
                body['is_automatic_email_send'] = false;
                body['attachment'] = [];
                body['default_tag'] = body.default_tag > 0 ? body.default_tag.toString() : "";
                body['from'] = body.from;
                resolve(body);
            }
        });
    });
};

export default {
    BaseProvider,
    changeUnreadStatus,
    deleteEmail,
    addNewCandidate
};