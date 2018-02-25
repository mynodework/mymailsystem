'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (sequelize, DataTypes) {
    var Tag = sequelize.define("TAG", {
        email: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING
        },
        color: DataTypes.STRING,
        subject: {
            type: DataTypes.STRING(255),
            unique: false
        },
        type: {
            type: DataTypes.ENUM,
            values: ["Default", "Manual", "Automatic"]
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
            beforeCreate: function beforeCreate(TAG, options) {
                var _this = this;

                return new Promise(function (resolve, reject) {
                    if (!TAG.parent_id) {
                        _this.findOne({ where: { subject: TAG.subject } }).then(function (docs) {
                            if (docs) {
                                reject("Subject Already Exists");
                            } else {
                                resolve({ docs: docs });
                            }
                        });
                    } else {
                        resolve();
                    }
                });
            }
        },
        timestamps: true,
        freezeTableName: true,
        allowNull: true,
        classMethods: {
            // login.....
            tag: function (_tag) {
                function tag(_x) {
                    return _tag.apply(this, arguments);
                }

                tag.toString = function () {
                    return _tag.toString();
                };

                return tag;
            }(function (tag_id) {
                var _this2 = this;

                app.route("/tag/add/:type").post(tag.save);
                return new Promise(function (resolve, reject) {
                    _this2.find({
                        where: {
                            id: tag_id
                        }
                    }).then(function (details) {
                        if (details) {
                            resolve({
                                status: 1
                            });
                        } else {
                            reject("Invalid tag_id");
                        }
                    });
                });
            }),
            assignTag: function assignTag(tag, email) {
                return new Promise(function (resolve, reject) {
                    email.find({}).then(function (data) {
                        var id = [];
                        _lodash2.default.map(data, function (val, key) {
                            if (val.subject.match(new RegExp(tag.subject, 'gi')) || tag.to && tag.from && new Date(val.date).getTime() < new Date(tag.to).getTime() && new Date(val.date).getTime() > new Date(tag.from).getTime() || tag.email && val.sender_mail.match(new RegExp(tag.email, 'gi'))) {
                                id.push(val._id);
                                if (key == _lodash2.default.size(data) - 1) {
                                    resolve(id);
                                }
                            } else {
                                if (key == _lodash2.default.size(data) - 1) {
                                    resolve(id);
                                }
                            }
                        });
                    }, function (err) {
                        reject(err);
                    });
                });
            },
            assignNewTag: function assignNewTag(tag, email) {
                return new Promise(function (resolve, reject) {
                    email.find({ tag_id: tag.parent_id.toString() }).then(function (data) {
                        var id = [];
                        _lodash2.default.map(data, function (val, key) {
                            if (tag.subject && val.subject.match(new RegExp(tag.subject, 'gi')) || tag.to && tag.from && new Date(val.date).getTime() < new Date(tag.to).getTime() && new Date(val.date).getTime() > new Date(tag.from).getTime() || tag.email && val.sender_mail.match(new RegExp(tag.email, 'gi'))) {
                                id.push(val._id);
                                if (key == _lodash2.default.size(data) - 1) {
                                    resolve(id);
                                }
                            } else {
                                if (key == _lodash2.default.size(data) - 1) {
                                    resolve(id);
                                }
                            }
                        });
                        resolve(id);
                    }, function (err) {
                        reject(err);
                    });
                });
            },
            destroyDefault: function destroyDefault(email, db, tagId, type) {
                return new Promise(function (resolve, reject) {
                    db.Tag.destroy({ where: { id: tagId, type: type, parent_id: { $ne: null } } }).then(function (docs) {
                        email.updateMany({ default_tag: tagId }, { $set: { "default_tag": "" } }).then(function (data) {
                            resolve("SUCCESS");
                        }).catch(function (err) {
                            return reject(err);
                        });
                    }).catch(function (err) {
                        return reject(err);
                    });
                });
            },
            findTagInfo: function findTagInfo(tagId) {
                var _this3 = this;

                return new Promise(function (resolve, reject) {
                    _this3.findById(tagId).then(function (response) {
                        resolve(response);
                    }).catch(function (error) {
                        reject({ error: 1, message: error, data: [] });
                    });
                });
            },
            assignTagDuringUpdate: function assignTagDuringUpdate(tag, req) {
                return new Promise(function (resolve, reject) {
                    req.email.find({ tag_id: { $ne: tag.toString() } }).then(function (data) {
                        var id = [];
                        if (data.length) {
                            _lodash2.default.map(data, function (val, key) {
                                if (val.subject.match(new RegExp(req.body.subject, 'gi')) || req.body.to && req.body.from && new Date(val.date).getTime() < new Date(req.body.to).getTime() && new Date(val.date).getTime() > new Date(req.body.from).getTime() || req.body.email && val.sender_mail.match(new RegExp(req.body.email, 'gi'))) {
                                    id.push(val._id);
                                    if (key == _lodash2.default.size(data) - 1) {
                                        assignTag(id);
                                    }
                                } else {
                                    if (key == _lodash2.default.size(data) - 1) {
                                        assignTag(id);
                                    }
                                }
                            });
                        } else {
                            resolve();
                        }

                        function assignTag(id) {
                            var mongoId = id.splice(0, 100);
                            req.email.update({ _id: { $in: mongoId } }, { "$set": { "tag_id": [tag.toString()] }, "email_timestamp": new Date().getTime(), updatedAt: new Date(), unread: false }, { multi: true }).then(function (data1) {
                                if (!id.length) {
                                    resolve({ message: "tag assigned sucessfully" });
                                } else {
                                    assignTag(id);
                                }
                            });
                        }
                    });
                });
            },
            updatePriority: function updatePriority(body) {
                return new Promise(function (resolve, reject) {
                    update_priority(body, function (response) {
                        resolve(response);
                    });
                });

                function update_priority(body, callback) {
                    var data = body.splice(0, 1)[0];
                    Tag.update({ priority: data.priority }, { where: { id: data.id } }).then(function (update_response) {
                        if (body.length) {
                            update_priority(body, callback);
                        } else {
                            callback("new priority is set");
                        }
                    });
                }
            },
            assignTagByKeyword: function assignTagByKeyword(subject) {
                var _this4 = this;

                return new Promise(function (resolve, reject) {
                    var tagId = [];
                    _this4.findAll({ type: (0, _constant2.default)().tagType.automatic, is_job_profile_tag: 1 }).then(function (response) {
                        _lodash2.default.forEach(response, function (val, key) {
                            if (val.keyword) {
                                var keywords = val.keyword.split(",");
                                _lodash2.default.forEach(keywords, function (keyword_val, keyword_key) {

                                    if ((subject != undefined ? subject.match(new RegExp(keyword_val, 'gi')) : false) != null) {
                                        tagId.push(val.id.toString());
                                    }
                                });
                            }
                            if (key == response.length - 1) {
                                resolve(tagId.filter(function (v, i, a) {
                                    return a.indexOf(v) === i;
                                }));
                            }
                        });
                    });
                });
            },
            removeTagFromEmails: function removeTagFromEmails(req) {
                return new Promise(function (resolve, reject) {
                    if (req.body.unread) {
                        req.email.update({ tag_id: req.body.tag_id, date: { "$gte": new Date(req.body.start), "$lt": new Date(req.body.end) } }, { tag_id: [], default_tag: "", unread: false, updatedAt: new Date() }, { multi: true }).then(function (response) {
                            resolve({ status: 1, message: "moved to all mails" });
                        });
                    } else {
                        req.email.update({ tag_id: req.body.tag_id, date: { "$gte": new Date(req.body.start), "$lt": new Date(req.body.end) } }, { tag_id: [], default_tag: "", updatedAt: new Date() }, { multi: true }).then(function (response) {
                            resolve({ status: 1, message: "moved to all mails" });
                        });
                    }
                });
            }
        },
        associate: function associate(models) {
            Tag.belongsTo(models.Template, { foreignKey: 'template_id', allowNull: true });
        }
    });
    return Tag;
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _constant = require('./constant.js');

var _constant2 = _interopRequireDefault(_constant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=tag.js.map