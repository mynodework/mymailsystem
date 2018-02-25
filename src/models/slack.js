let IncomingWebhook = require('@slack/client').IncomingWebhook;

export default function(sequelize, DataTypes) {
    const Slack = sequelize.define("SLACK", {
        teamName: DataTypes.STRING,
        token: DataTypes.STRING,
        selected_channel: DataTypes.STRING,
        status: DataTypes.BOOLEAN
    }, {
        timestamps: true,
        freezeTableName: true,
        allowNull: true,
        classMethods: {
            addSlack(slackInfo) {
                return new Promise((resolve, reject) => {
                    let webhook = new IncomingWebhook(slackInfo.token);
                    webhook.send("New App Is Added To Channel", function(err, header, statusCode, body) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(statusCode)
                        }
                    });
                });
            },
            slackData() {
                return new Promise((resolve, reject) => {
                    let slackData = [];
                    this.findAll().then((response) => {
                        resolve(response)
                    })
                });
            }
        }
    });
    return Slack;
}