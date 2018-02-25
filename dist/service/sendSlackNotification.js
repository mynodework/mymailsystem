"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _db = require("../db.js");

var _db2 = _interopRequireDefault(_db);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IncomingWebhook = require('@slack/client').IncomingWebhook;


var slackNotification = function slackNotification(data, user_email) {
    return new Promise(function (resolve, reject) {
        _db2.default.Slack.findOne({ where: { status: true } }).then(function (slackInfo) {
            if (slackInfo.id) {
                var url = slackInfo.token || _config2.default.slackToken;
                var webhook = new IncomingWebhook(url);
                userIcon(user_email, function (response) {
                    data += "\n picture: " + response;
                    webhook.send(data, function (err, header, statusCode, body) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(statusCode);
                        }
                    });
                });
            } else {
                resolve("No slack information");
            }

            function userIcon(email, callback) {
                (0, _request2.default)("http://picasaweb.google.com/data/entry/api/user/" + email + "?alt=json", function (error, response, body) {
                    if (!error) {
                        try {
                            callback(JSON.parse(body).entry.gphoto$thumbnail.$t);
                        } catch (e) {
                            callback("Invalid Email Address");
                        }
                    }
                });
            }
        });
    });
};

exports.default = {
    slackNotification: slackNotification
};
//# sourceMappingURL=sendSlackNotification.js.map