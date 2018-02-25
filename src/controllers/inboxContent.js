import BaseAPIController from "./BaseAPIController";
import UserProvider from "../providers/UserProvider.js";
import constant from "../models/constant";
import email_process from "../mongodb/emailprocess";
import db from "../db";

export class inboxContent extends BaseAPIController {

    /* Controller for new  Inbox content  */
    inbox = (req, res, next) => {
        let response = [];
        UserProvider.validateParam(req.params).then((params) => {
            let page=parseInt(params.page_no)-1;
            req.email.find({},{ "_id": 1, "date": 1, "email_date": 1, "uid": 1, "is_automatic_email_send": 1, "from": 1, "sender_mail": 1, "subject": 1, "unread": 1, "attachment": 1, "tag_id": 1, "is_attachment": 1, "default_tag": 1, "mobile_no": 1, "notes": 1 }, { sort: { date: -1 } }).skip(page * params.emailLimit).limit(parseInt(params.emailLimit)).then((fetched) => {
                    response.push({ emailFetch: fetched })
                    db.Tag.findAll().then((data) => {
                        response.push({ Tag: data })
                        console.log(response)
                        this.handleSuccessResponse(req, res, next, response)
                    }, (err) => { this.handleErrorResponse(null, err) })
            }, (err) => { this.handleErrorResponse(null, err) })
        }, (err) => { this.handleErrorResponse(null, err) })
    }
}

const inboxContents = new inboxContent();
export default inboxContents;