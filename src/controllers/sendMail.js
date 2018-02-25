import BaseAPIController from "./BaseAPIController";
import mail_send from "../modules/send_mail";
import constant from "../models/constant";
import email_process from "../mongodb/emailprocess";
import logs from "../service/emaillogs";

export class sendMail extends BaseAPIController {
    /* Controller for send mail */
    send_mail = (req, res, next) => {
        this._db.Smtp.smtp_details().then((smtp_info, err) => {
            mail_send.send_mail(req.body.subject, req.body.text, req.body.html, req.body.filename, req.body.content, smtp_info)
                .then((response) => {
                    this.handleSuccessResponse(req, res, next, response)
                })
        }).catch(this.handleErrorResponse.bind(null, res));
    }

    updateEmails = (req, res, next) => {
        mail_send.updateMails(req.email).then((response) => {
            this.handleSuccessResponse(req, res, next, response)
        }).catch(this.handleErrorResponse.bind(null, res));
    }
}

const sendMails = new sendMail();
export default sendMails;