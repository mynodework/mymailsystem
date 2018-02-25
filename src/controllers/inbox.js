import BaseAPIController from "./BaseAPIController";

export class InboxController extends BaseAPIController {
    /* Get INBOX data*/
    getInbox = (req, res, next) => {
        req.email.find().skip((req.params.page - 1) * parseInt(req.params.limit)).limit(parseInt(req.params.limit)).sort({
            date: -1
        }).exec((err, data) => {
            if (err) {
                next(new Error("invalid page"));
            } else {
                this.handleSuccessResponse(req, res, next, { data });
            }
        });
    }

    /* Get Emails By EmailId*/
    getByEmailId = (req, res, next) => {
        var re = /\S+@\S+\.\S+/;
        if (re.test(req.params.emailid)) {
            var where = { sender_mail: req.params.emailid }
        } else {
            where = { _id: req.params.emailid }
        }
        req.email.find(where).sort({
            date: -1
        }).exec((err, final) => {
            if (err) {
                next(new Error(err));
            } else {
                if (final.length) {
                    req.history.find({ sender_mail: final[0].sender_mail }).sort({ date: -1 }).then((response) => {
                        let data = final.concat(response);
                        this.handleSuccessResponse(req, res, next, { data });
                    })
                } else {
                    this.handleSuccessResponse(req, res, next, { final })
                }
            }
        });
    }


    /* Get UID data*/
    getUid = (req, res, next) => {
        req.email.findOne({
            uid: parseInt(req.params.uid)
        }).exec((err, data) => {
            if (err) {
                next(new Error("invalid UID"));
            } else {
                this.handleSuccessResponse(req, res, next, { data });
            }
        });
    }
}

const controller = new InboxController();
export default controller;