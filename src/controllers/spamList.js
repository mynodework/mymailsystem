import BaseAPIController from "./BaseAPIController";
import SpamListProvider from "../providers/SpamListProvider.js";
import spamWork from "../service/spamWork";

export class VariableController extends BaseAPIController {

    /* Controller for deletespamList create  */
    create = (req, res, next) => {
        SpamListProvider.save(this._db, req.checkBody, req.body, req.getValidationResult())
            .then((spamData) => {
                this._db.SpamList.create(spamData)
                    .then((data) => this.handleSuccessResponse(req, res, next, data))
                    .catch(this.handleErrorResponse.bind(null, res));
            }).catch(this.handleErrorResponse.bind(null, res));
    }

    /* deletespamList Update */
    update = (req, res, next) => {
        SpamListProvider.save(this._db, req.checkBody, req.body, req.getValidationResult())
            .then((data) => {
                this._db.SpamList.update(data, {
                        where: {
                            id: req.params.spamListId
                        }
                    })
                    .then((docs) => {
                        this.handleSuccessResponse(req, res, next, { status: "SUCCESS" });
                    })
            }).catch(this.handleErrorResponse.bind(null, res));
    }



    /* deletespamList delete */
    deletespamList = (req, res, next) => {
        this._db.SpamList.destroy({
                where: {
                    id: req.params.spamListId
                }
            })
            .then((docs) => {
                this.handleSuccessResponse(req, res, next, { status: "SUCCESS" });
            }).catch(this.handleErrorResponse.bind(null, res));
    }

    /* Get List of All Templates */
    spamList = (req, res, next) => {
        this._db.SpamList.findAll({
                offset: (req.params.page - 1) * parseInt(req.params.limit),
                limit: parseInt(req.params.limit),
                order: '`id` DESC'
            })
            .then((data) => this.handleSuccessResponse(req, res, next, data))
            .catch(this.handleErrorResponse.bind(null, res));
    }


    /* Get Variable data using id*/
    idResult = (req, res, next, spamListId) => {
        this.getById(req, res, this._db.SpamList, spamListId, next);
    }

    getspamListById = (req, res, next) => {
        this._db.SpamList.findById(parseInt(req.params.spamListId)).then((response) => {
            this.handleSuccessResponse(req, res, next, response)
        })
    }

    /*remove spam from job profiile*/

    removeSpam = (req, res, next) => {
        spamWork.removeSpam(req, this._db).then((data) => {
            // req.email.remove({_id:{$in:}})
            this.handleSuccessResponse(req, res, next, data)
        }).catch(this.handleErrorResponse.bind(null, res));
    }

    spamCandidate = (req, res, next) => {
        req.email.find({ sender_mail: req.params.email }).then((spamEmails) => {
            req.spamBox.insertMany(spamEmails).then((movedToSpam) => {
                req.email.find({ sender_mail: req.params.email }).remove().then((response) => {
                    this._db.SpamList.create({ email: req.params.email }).then((spamEmailAdded) => {
                        this.handleSuccessResponse(req, res, next, { status: "SUCCESS" })
                    })
                })
            })
        })
    }

}

const controller = new VariableController();
export default controller;