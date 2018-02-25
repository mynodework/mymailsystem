"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var checkHistoryMsg = function checkHistoryMsg(seqno, flag, uid, answered, email_data_to_store, tag, body, attach, email, candidate_history) {
    return new Promise(function (resolve, reject) {
        email.findOne({ sender_mail: email_data_to_store.sender_mail }).then(function (response) {
            if (response) {
                candidate_history.findOne({ uid: uid, imap_email: email_data_to_store.to }).then(function (history_saved) {
                    if (history_saved) {
                        resolve(1);
                    } else {
                        var history_data = new candidate_history({
                            email_id: seqno,
                            from: email_data_to_store.from,
                            to: email_data_to_store.to,
                            sender_mail: email_data_to_store.sender_mail,
                            date: email_data_to_store.date,
                            email_date: email_data_to_store.email_date,
                            email_timestamp: email_data_to_store.email_timestamp,
                            subject: email_data_to_store.subject,
                            unread: true,
                            answered: answered,
                            uid: uid,
                            body: body,
                            tag_id: tag.tagId,
                            is_automatic_email_send: tag.is_automatic_email_send || 0,
                            default_tag: tag.default_tag_id || "",
                            is_attachment: attach || false,
                            imap_email: email_data_to_store.to,
                            send_template_count: tag.count || 0,
                            template_id: tag.template_id || [],
                            reply_to_id: tag.reply_to_id,
                            attachment: []
                        });

                        history_data.save(function (err) {
                            if (tag.default_tag_id) {
                                email.update({ _id: response._id }, { "$set": { "unread": true, "updatedAt": new Date(), default_tag: tag.default_tag_id } }).then(function (updated_candidate_mail) {
                                    console.log("updated", response._id);
                                    resolve(1);
                                });
                            } else {
                                email.update({ _id: response._id }, { "$set": { "unread": true, "updatedAt": new Date() } }).then(function (updated_candidate_mail) {
                                    console.log("updated", response._id);
                                    resolve(1);
                                });
                            }
                        });
                    }
                });
            } else {
                resolve(0);
            }
        });
    });
};

exports.default = {
    checkHistoryMsg: checkHistoryMsg
};
//# sourceMappingURL=candidateHistory.js.map