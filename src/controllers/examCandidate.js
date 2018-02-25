import UserProvider from "../providers/UserProvider.js";
import BaseAPIController from "./BaseAPIController";

export class examCandidateController extends BaseAPIController {
    /* Controller for online exam candidate */
    exam_candidate = (req, res, next) => {
        UserProvider.fb_login(req.checkBody, req.body, req.getValidationResult())
            .then((user) => {
                this._db.examCandidate.signup_login(req.email, user)
                    .then((data) => { this.handleSuccessResponse(req, res, next, data) })
                    .catch(this.handleErrorResponse.bind(null, res));
            })
            .catch(this.handleErrorResponse.bind(null, res));
    }
}

const controller = new examCandidateController();
export default controller;