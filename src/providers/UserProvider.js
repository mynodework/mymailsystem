import crypto from "crypto";
import * as BaseProvider from "./BaseProvider";
import util from "util";

/* Provider for User Registration */
const create = (model, validate, body, validationResult) => {
    return new Promise((resolve, reject) => {
        validate("email", "email cannot be empty").notEmpty();
        validate("user_type", "user_type cannot be empty").notEmpty();
        validate("password", "password cannot be empty").notEmpty();
        validate("confirm_password", "confirm_password cannot be empty").notEmpty();
        validationResult.then(function(result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
                return;
            } else {
                if (body.password == body.confirm_password) {
                    delete body.confirm_password;
                    body.password = crypto.createHash("sha256").update(body.password).digest("base64");
                    resolve(body);
                } else {
                    reject("Password Not Matched");
                }
            }
        });
    });
};

/* Provider for User login */
const login = (model, body) => {
    let password = crypto.createHash("sha256").update(body.password).digest("base64");
    delete body.confirm_password;
    return { ...body,
        ...{
            password
        }
    };

};

const validateParam = (params) => {
    return new Promise((resolve, reject) => {
        if (params.emailLimit <= 100) {
            resolve(params)
        } else {
            reject("Maximum 100 records allowed only!!")
        }
    });
}

/* Provider for fb login for exam candidate*/
const fb_login = (validate, body, validationResult) => {
    return new Promise((resolve, reject) => {
        validate("name", "name cannot be empty").notEmpty();
        validate("email", "email cannot be empty").notEmpty();
        validate("email", "email is not valid").isEmail();
        validate("gender", "gender cannot be empty").notEmpty();
        validate("fb_id", "fb_id cannot be empty").notEmpty();
        validate("profile_pic", "profile_pic cannot be empty").notEmpty();
        validate("appliedEmail", "appliedEmail cannot be empty").notEmpty();
        validate("appliedEmail", "appliedEmail is not valid").isEmail();
        validationResult.then(function(result) {
            if (!result.isEmpty()) {
                reject(result.array()[0].msg);
                return;
            } else {
                resolve(body);
            }
        });
    });
};

export default {
    ...BaseProvider,
    create,
    login,
    validateParam,
    fb_login
};