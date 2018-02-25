import examProvider from "../providers/examsProvider";
import slack from '../service/sendSlackNotification';

export default function(sequelize, DataTypes) {
    const examSubject = sequelize.define("examSubjects", {
        exam_subject: {
            type: DataTypes.STRING,
        }
    }, {
        timestamps: true,
        freezeTableName: true,
        allowNull: true,
        classMethods: {
            exam_subject(body) {
                return new Promise((resolve, reject) => {
                    this.findOne({ where: { exam_subject: body.exam_subject } }).then((response) => {
                        if (!response) {
                            this.create(body).then((user) => {
                                resolve(user)
                            }, (err) => { reject(err) })
                        } else {
                            reject("subject already exist")
                        }
                    }, (err) => { reject(err) })
                })
            }
        }
    });
    return examSubject;
}