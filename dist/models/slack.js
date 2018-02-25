"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (sequelize, DataTypes) {
    var Slack = sequelize.define("SLACK", {
        teamName: DataTypes.STRING,
        token: DataTypes.STRING,
        selected_channel: DataTypes.STRING,
        status: DataTypes.BOOLEAN
    }, {
        timestamps: true,
        freezeTableName: true,
        allowNull: true,
        classMethods: {
            addSlack: function addSlack(slackInfo) {
                return new Promise(function (resolve, reject) {
                    var webhook = new IncomingWebhook(slackInfo.token);
                    webhook.send("New App Is Added To Channel", function (err, header, statusCode, body) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(statusCode);
                        }
                    });
                });
            },
            slackData: function slackData() {
                var _this = this;

                return new Promise(function (resolve, reject) {
                    var slackData = [];
                    _this.findAll().then(function (response) {
                        resolve(response);
                    });
                });
            }
        }
    });
    return Slack;
};

var IncomingWebhook = require('@slack/client').IncomingWebhook;
//# sourceMappingURL=slack.js.map