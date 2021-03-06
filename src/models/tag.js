import _ from 'lodash';
import constant from './constant.js';

export default function(sequelize, DataTypes) {
    const Tag = sequelize.define("TAG", {
        email: {
            type: DataTypes.STRING,
        },
        title: {
            type: DataTypes.STRING,
        },
        color: DataTypes.STRING,
        subject: {
            type: DataTypes.STRING(255),
            unique: false,
        },
        type: {
            type: DataTypes.ENUM,
            values: ["Default", "Manual", "Automatic"],
        },
        is_job_profile_tag: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        to: DataTypes.DATE,
        from: DataTypes.DATE,
        assign_to_all_emails: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        template_id: { type: DataTypes.INTEGER },
        default_id: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        is_email_send: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        job_description: {
            type: DataTypes.STRING,
            defaultValue: "",
            allowNull: true
        },
        priority: {
            type: DataTypes.STRING,
            defaultValue: 0,
            allowNull: true
        },
        parent_id: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true
        },
        keyword: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true
        }
    }, {
        hooks: {
            beforeCreate: function(TAG, options) {
                return new Promise((resolve, reject) => {
                    if (!TAG.parent_id) {
                        this.findOne({ where: { subject: TAG.subject } })
                            .then((docs) => {
                                if (docs) {
                                    reject("Subject Already Exists");
                                } else {
                                    resolve({ docs })
                                }
                            })
                    } else {
                        resolve()
                    }
                })
            }
        },
        timestamps: true,
        freezeTableName: true,
        allowNull: true,
        classMethods: {
            // login.....
            tag(tag_id) {
                app.route("/tag/add/:type").post(tag.save);
                return new Promise((resolve, reject) => {
                    this.find({
                            where: {
                                id: tag_id
                            }
                        })
                        .then((details) => {
                            if (details) {
                                resolve({
                                    status: 1
                                });
                            } else {
                                reject("Invalid tag_id");
                            }
                        });
                });
            },
            assignTag(tag, email) {
                return new Promise((resolve, reject) => {
                    email.find({})
                        .then((data) => {
                            var id = []
                            _.map(data, (val, key) => {
                                if ((val.subject.match(new RegExp(tag.subject, 'gi'))) || ((tag.to && tag.from) && (new Date(val.date).getTime() < new Date(tag.to).getTime() && new Date(val.date).getTime() > new Date(tag.from).getTime())) || ((tag.email) && (val.sender_mail.match(new RegExp(tag.email, 'gi'))))) {
                                    id.push(val._id);
                                    if (key == (_.size(data) - 1)) {
                                        resolve(id)
                                    }
                                } else {
                                    if (key == (_.size(data) - 1)) {
                                        resolve(id)
                                    }
                                }

                            })
                        }, (err) => {
                            reject(err)
                        })
                })
            },
            assignNewTag(tag, email) {
                return new Promise((resolve, reject) => {
                    email.find({ tag_id: (tag.parent_id).toString() })
                        .then((data) => {
                            var id = []
                            _.map(data, (val, key) => {
                                if ((tag.subject && val.subject.match(new RegExp(tag.subject, 'gi'))) || ((tag.to && tag.from) && (new Date(val.date).getTime() < new Date(tag.to).getTime() && new Date(val.date).getTime() > new Date(tag.from).getTime())) || ((tag.email) && (val.sender_mail.match(new RegExp(tag.email, 'gi'))))) {
                                    id.push(val._id);
                                    if (key == (_.size(data) - 1)) {
                                        resolve(id)
                                    }
                                } else {
                                    if (key == (_.size(data) - 1)) {
                                        resolve(id)
                                    }
                                }

                            })
                            resolve(id)
                        }, (err) => {
                            reject(err)
                        })
                })
            },
            destroyDefault(email, db, tagId, type) {
                return new Promise((resolve, reject) => {
                    db.Tag.destroy({ where: { id: tagId, type: type, parent_id: { $ne: null } } })
                        .then((docs) => {
                            email.updateMany({ default_tag: tagId }, { $set: { "default_tag": "" } }).then((data) => {
                                resolve("SUCCESS")
                            }).catch(err => reject(err))
                        }).catch(err => reject(err))
                })
            },
            findTagInfo(tagId) {
                return new Promise((resolve, reject) => {
                    this.findById(tagId)
                        .then((response) => { resolve(response) })
                        .catch((error) => { reject({ error: 1, message: error, data: [] }) })
                })
            },
            assignTagDuringUpdate(tag, req) {
                return new Promise((resolve, reject) => {
                    req.email.find({ tag_id: { $ne: tag.toString() } }).then((data) => {
                        let id = []
                        if (data.length) {
                            _.map(data, (val, key) => {
                                if ((val.subject.match(new RegExp(req.body.subject, 'gi'))) || ((req.body.to && req.body.from) && (new Date(val.date).getTime() < new Date(req.body.to).getTime() && new Date(val.date).getTime() > new Date(req.body.from).getTime())) || ((req.body.email) && (val.sender_mail.match(new RegExp(req.body.email, 'gi'))))) {
                                    id.push(val._id);
                                    if (key == (_.size(data) - 1)) {
                                        assignTag(id)
                                    }
                                } else {
                                    if (key == (_.size(data) - 1)) {
                                        assignTag(id)
                                    }
                                }

                            })
                        } else {
                            resolve();
                        }

                        function assignTag(id) {
                            let mongoId = id.splice(0, 100)
                            req.email.update({ _id: { $in: mongoId } }, { "$set": { "tag_id": [tag.toString()] }, "email_timestamp": new Date().getTime(), updatedAt: new Date(), unread: false }, { multi: true })
                                .then((data1) => {
                                    if (!id.length) {
                                        resolve({ message: "tag assigned sucessfully" })
                                    } else {
                                        assignTag(id)
                                    }
                                })
                        }
                    })
                });
            },
            updatePriority(body) {
                return new Promise((resolve, reject) => {
                    update_priority(body, function(response) {
                        resolve(response)
                    })
                });

                function update_priority(body, callback) {
                    let data = body.splice(0, 1)[0];
                    Tag.update({ priority: data.priority }, { where: { id: data.id } }).then((update_response) => {
                        if (body.length) {
                            update_priority(body, callback)
                        } else {
                            callback("new priority is set")
                        }
                    })
                }
            },
            assignTagByKeyword(subject) {
                return new Promise((resolve, reject) => {
                    let tagId = []
                    this.findAll({ type: constant().tagType.automatic, is_job_profile_tag: 1 }).then((response) => {
                        _.forEach(response, (val, key) => {
                            if (val.keyword) {
                                let keywords = val.keyword.split(",");
                                _.forEach(keywords, (keyword_val, keyword_key) => {

                                    if ((subject != undefined ? subject.match(new RegExp(keyword_val, 'gi')) : false) != null) {
                                        tagId.push(val.id.toString())
                                    }
                                })
                            }
                            if (key == response.length - 1) {
                                resolve(tagId.filter((v, i, a) => a.indexOf(v) === i))
                            }
                        })
                    })
                });
            },
            removeTagFromEmails(req) {
                return new Promise((resolve, reject) => {
                    if (req.body.unread) {
                        req.email.update({ tag_id: req.body.tag_id, date: { "$gte": new Date(req.body.start), "$lt": new Date(req.body.end) } }, { tag_id: [], default_tag: "", unread: false, updatedAt: new Date() }, { multi: true }).then((response) => {
                            resolve({ status: 1, message: "moved to all mails" })
                        })
                    } else {
                        req.email.update({ tag_id: req.body.tag_id, date: { "$gte": new Date(req.body.start), "$lt": new Date(req.body.end) } }, { tag_id: [], default_tag: "", updatedAt: new Date() }, { multi: true }).then((response) => {
                            resolve({ status: 1, message: "moved to all mails" })
                        })
                    }

                });
            }
        },
        associate: (models) => {
            Tag.belongsTo(models.Template, { foreignKey: 'template_id', allowNull: true })
        }
    });
    return Tag;
}