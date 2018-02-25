import examProvider from "../providers/examsProvider";
import slack from '../service/sendSlackNotification';

export default function(sequelize, DataTypes) {
    const examCandidate = sequelize.define("examCandidate", {
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        gender: {
            type: DataTypes.STRING,
        },
        fb_id: {
            type: DataTypes.BIGINT,
        },
        profile_pic: {
            type: DataTypes.STRING,
        },
        examScore: {
            type: DataTypes.INTEGER,
        },
        examToken: {
            type: DataTypes.STRING,
        }
    }, {
        timestamps: true,
        freezeTableName: true,
        allowNull: true,
        classMethods: {
            signup_login(email, body) {
                return new Promise((resolve, reject) => {
                    examProvider.randomNumber().then((examToken) => {
                        body.examToken = examToken
                        let slack_message = "Candidate name " + body.name + "\n" + " Candidate email: " + body.appliedEmail + "\n" + " Exam Token: " + body.examToken;
                        email.findOne({ sender_mail: body.appliedEmail }).then((get_email) => {
                            if (get_email) {
                                if ((get_email.candidate_status != undefined && !get_email.candidate_status)) {
                                    reject({ message: "Contact with Hr To Approve And Assign A Profile" })
                                } else {
                                    email.update({ sender_mail: body.appliedEmail }, { $set: { fb_id: body.fb_id } }, { multi: true }).then((resp) => {
                                        this.findOne({ where: { email: body.email } })
                                            .then((response) => {
                                                if (response) {
                                                    this.update(body, { where: { email: body.email } })
                                                        .then((user) => {
                                                            if (user) {
                                                                slack.slackNotification(slack_message, body.appliedEmail).then((slack_response) => {
                                                                    if (slack_response == 200) {
                                                                        resolve({
                                                                            status: 1,
                                                                            message: "OTP sent to the HR"
                                                                        })
                                                                    }
                                                                }, (err) => { reject(err) })
                                                            } else {
                                                                reject('could not login')
                                                            }
                                                        }, (err) => { reject(err) })
                                                } else {
                                                    this.create(body).then((user) => {
                                                        if (user) {
                                                            slack.slackNotification(slack_message, body.appliedEmail).then((slack_response) => {
                                                                if (slack_response == 200) {
                                                                    resolve({
                                                                        status: 1,
                                                                        message: "OTP sent to the HR"
                                                                    })
                                                                } else {
                                                                    reject("could not generate OTP")
                                                                }
                                                            }, (err) => { reject(err) })
                                                        } else {
                                                            reject('could not login');
                                                        }
                                                    }, (err) => { reject(err) })
                                                }
                                            }, (err) => { reject(err) })
                                    })
                                }
                            } else {
                                resolve({ status: 0, message: "have you applied with another email?" })
                            }
                        }, (err) => { reject(err) })

                    })
                })
            }
        }
    });
    return examCandidate;
}