import db from "../db.js";
import _ from "lodash";

let reArrange = (email, history) => {
    return new Promise((resolve, reject) => {
        let tag_id = [];
        let notes = [];
        let template_id = [];
        let default_tag = 0;
        let default_tags;
        let priority_tag = [];
        email.find().distinct('sender_mail').then((sender_mail) => {
            db.Tag.findAll({ where: { type: "Default", parent_id: { $eq: 0 } } }).then((default_tag_data) => {
                default_tags = default_tag_data
                findAndUpdate(sender_mail, function(response) {
                    console.log("all db is synced= ", response)
                })
            })
        })

        function findAndUpdate(candidate_list, callback) {
            console.log("left unique candidate => ", candidate_list.length)
            let candidateEmail = candidate_list.splice(0, 1)[0]
            email.find({ sender_mail: candidateEmail }, { _id: 1, date: 1, sender_mail: 1, notes: 1, tag_id: 1, default_tag: 1, template_id: 1 }).sort({ "date": 1 }).then((candidateOldestEmail) => {
                if (candidateOldestEmail.length > 1) {
                    moveEmailToHistory(candidateOldestEmail[0], function(movedData) {
                        if (candidate_list.length) {
                            findAndUpdate(candidate_list, callback)
                        } else {
                            callback(true)
                        }
                    })
                } else {
                    if (candidate_list.length) {
                        findAndUpdate(candidate_list, callback)
                    } else {
                        callback(true)
                    }
                }
            })

        }

        function moveEmailToHistory(candidate, callback) {
            tag_id.push(candidate.tag_id ? candidate.tag_id : [])
            notes.push(candidate.notes ? candidate.notes : [])
            template_id.push(candidate.template_id ? candidate.template_id : [])
            default_tag = (candidate.default_tag != "") ? candidate.default_tag : 0;
            email.find({ sender_mail: candidate.sender_mail, _id: { $ne: candidate._id } }, { tag_id: 1, default_tag: 1, notes: 1 }).then((response) => {
                let history_mail = response;
                findTagAndNote(response, function(tagInfo) {
                    if (tagInfo.default_tag == undefined) {
                        tagInfo['default_tag'] = ""
                    } else {
                        tagInfo['default_tag'] = tagInfo.default_tag.id
                    }
                    priority_tag = [];
                    tag_id = [];
                    notes = [];
                    template_id = [];
                    email.find({ sender_mail: candidate.sender_mail, _id: { $ne: candidate._id } }).then((response) => {
                        history.insertMany(response).then((historyCreated) => {
                            if (historyCreated) {
                                email.update({ _id: candidate._id }, { tag_id: tagInfo.tag_id, default_tag: tagInfo.default_tag, notes: tagInfo.notes, template_id: tagInfo.template_id }).then((updated_email) => {
                                    email.find({ sender_mail: candidate.sender_mail, _id: { $ne: candidate._id } }).remove().then((response) => {
                                        callback(true)
                                    })
                                })
                            }
                        })
                    })
                })

            })
        }

        function findTagAndNote(emails, callback) {
            db.Tag.findAll({ where: { type: "Default", $or: [{ parent_id: { $eq: 0 } }, { parent_id: null }] } }).then((default_tag_data) => {
                let candidate_status = emails.splice(0, 1)[0];
                console.log(candidate_status)
                if (candidate_status.default_tag == "" || candidate_status.default_tag == undefined) {
                    candidate_status.default_tag = default_tag;
                }
                if (candidate_status.tag_id && candidate_status.tag_id.length) {
                    tag_id.push(candidate_status.tag_id);
                }
                if (candidate_status.notes && candidate_status.notes.length) {
                    notes.push(candidate_status.notes);
                }
                if (candidate_status.template_id && candidate_status.template_id.length) {
                    notes.push(candidate_status.template_id);
                }
                _.forEach(default_tag_data, (val, key) => {
                    if (val.dataValues.id == candidate_status.default_tag) {
                        priority_tag.push({ id: val.dataValues.id, priority: val.dataValues.default_id })
                    }

                    if (key == default_tag_data.length - 1) {
                        if (emails.length) {
                            findTagAndNote(emails, callback)
                        } else {
                            callback({ default_tag: _.maxBy(priority_tag, 'priority'), tag_id: _.flattenDeep(tag_id), notes: _.flattenDeep(notes), template_id: _.flattenDeep(template_id) })
                        }
                    }
                })
            })
        }
    })
}

export default {
    reArrange
}