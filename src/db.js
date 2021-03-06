import Sequelize from "sequelize";
import models from "./models";
import constant from "./models/constant";
import config from "./config";
import migration from "../migrations/index.js"
const db = {};

// create your instance of sequelize
const sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, { port: 3306, host: config.db.host });

// load models
Object.keys(models).forEach((modelName) => {
    const model = models[modelName](sequelize, Sequelize.DataTypes);
    db[modelName] = model;
});

// invoke associations on each of the models
Object.keys(db).forEach((modelName) => {
    if (db[modelName].options.associate) {
        db[modelName].options.associate(db);
    }
});

sequelize.sync().then(() => {
    db.User.findAll().then((response) => {
        if (!response.length) {
            db.User.create({ email: "123@gmail.com", password: "pmWkWSBCL51Bfkhn79xPuKBKHz//H6B+mY6G9/eieuM=", user_type: "Admin" })
        }
    })

    db.Tag.findOne({ where: { type: constant().tagType.default, title: "Shortlist" } })
        .then((id) => {
            if (!id) {
                db.Tag.create({ title: "Shortlist", type: constant().tagType.default, color: "#cb891b", default_id: 3 });
            }
        });

    db.Tag.findOne({ where: { type: constant().tagType.default, title: "Reject" } })
        .then((id) => {
            if (!id) {
                db.Tag.create({ title: "Reject", type: constant().tagType.default, color: "#ef2e46", default_id: 8 });
            }
        });

    db.Tag.findOne({ where: { type: constant().tagType.default, title: "First Round" } })
        .then((id) => {
            if (!id) {
                db.Tag.create({ title: "First Round", type: constant().tagType.default, color: "#ba21d3", default_id: 4 });
            }
        });
    db.Tag.findOne({ where: { type: constant().tagType.default, title: "Second Round" } })
        .then((id) => {
            if (!id) {
                db.Tag.create({ title: "Second Round", type: constant().tagType.default, color: "#ba21d3", default_id: 5 });
            }
        });
    db.Tag.findOne({ where: { type: constant().tagType.default, title: "Third Round" } })
        .then((id) => {
            if (!id) {
                db.Tag.create({ title: "Third Round", type: constant().tagType.default, color: "#ba21d3", default_id: 6 });
            }
        });
    db.Tag.findOne({ where: { type: constant().tagType.default, title: "Genuine Applicant" } })
        .then((id) => {
            if (!id) {
                db.Tag.create({ title: "Genuine Applicant", type: constant().tagType.default, color: "#cb891b", default_id: 1 });
            }
        });

    db.Tag.findOne({ where: { type: constant().tagType.default, title: "Selected" } })
        .then((id) => {
            if (!id) {
                db.Tag.create({ title: "Selected", type: constant().tagType.default, color: "#ef2f50", default_id: 9 });
            }
        });

    db.Tag.findOne({ where: { type: constant().tagType.default, title: "Hold" } })
        .then((id) => {
            if (!id) {
                db.Tag.create({ title: "Hold", type: constant().tagType.default, color: "#FF0000", default_id: 7 });
            }
        });

    db.Tag.findOne({ where: { type: constant().tagType.default, title: "CV Rejected" } })
        .then((id) => {
            if (!id) {
                db.Tag.create({ title: "CV Rejected", type: constant().tagType.default, color: "#FFE4C4", default_id: 2 });
            }
        });

    db.SystemVariable.findOne({ where: { variableCode: "#date" } })
        .then((id) => {
            if (!id) {
                db.SystemVariable.create({ variableCode: "#date" });
            }
        });

    db.SystemVariable.findOne({ where: { variableCode: "#candidate_name" } })
        .then((id) => {
            if (!id) {
                db.SystemVariable.create({ variableCode: "#candidate_name" });
            }
        });

    db.SystemVariable.findOne({ where: { variableCode: "#page_break" } })
        .then((id) => {
            if (!id) {
                db.SystemVariable.create({ variableCode: "#page_break" });
            }
        });
    db.SystemVariable.findOne({ where: { variableCode: "#logo" } })
        .then((id) => {
            if (!id) {
                db.SystemVariable.create({ variableCode: "#logo" });
            }
        });
    db.SystemVariable.findOne({ where: { variableCode: "#scheduled_date" } })
        .then((id) => {
            if (!id) {
                db.SystemVariable.create({ variableCode: "#scheduled_date" });
            }
        });
    db.SystemVariable.findOne({ where: { variableCode: "#scheduled_time" } })
        .then((id) => {
            if (!id) {
                db.SystemVariable.create({ variableCode: "#scheduled_time" });
            }
        });
    db.SystemVariable.findOne({ where: { variableCode: "#tag_name" } })
        .then((id) => {
            if (!id) {
                db.SystemVariable.create({ variableCode: "#tag_name" });
            }
        });
}, (err) => {
    console.log("Incorrect Sequelize Db Details Update config details");
    process.exit(0)
});

export default Object.assign({}, db, {
    sequelize,
    Sequelize
});