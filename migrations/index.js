var _ = require("lodash")
var moment = require("moment")
module.exports = {
    up: (queryInterface, Sequelize) => {
        return new Promise((resolve, reject) => {
            // logic for transforming into the new state
            let result = []
            let add_field = [
                { table: "TAG", field: "default_id", type: Sequelize.INTEGER, value: 0, allowNull: false },
                { table: "TAG", field: "job_description", type: Sequelize.STRING, value: "", allowNull: false },
                { table: "IMAP", field: "last_fetched_time", type: Sequelize.DATE, value: new Date(), allowNull: false },
                { table: "IMAP", field: "total_emails", type: Sequelize.INTEGER, value: 0, allowNull: false },
                { table: "SMTP", field: "username", type: Sequelize.STRING(255), value: "", allowNull: false },
                { table: "TAG", field: "is_email_send", type: Sequelize.BOOLEAN, value: 0, allowNull: false },
                { table: "TAG", field: "priority", type: Sequelize.INTEGER, value: 0, allowNull: true },
                { table: "IMAP", field: "days_left_to_fetched", type: Sequelize.INTEGER, value: 0, allowNull: true },
                { table: "IMAP", field: "fetched_date_till", type: Sequelize.DATE, value: 0, allowNull: true },
                { table: "TAG", field: "parent_id", type: Sequelize.INTEGER, value: 0, allowNull: true },
                { table: "TAG", field: "keyword", type: Sequelize.STRING, value: null, allowNull: true }
            ]
            _.forEach(add_field, (val, key) => {
                queryInterface.describeTable(val.table).then(attributes => {
                    if (attributes[val.field]) {
                        result.push(1)
                        if (key == add_field.length - 1 && result.length == add_field.length) {
                            resolve("SUCCESS")
                        }
                    } else if (attributes) {
                        let type = val['type'];
                        result.push(queryInterface.addColumn(val.table, val.field, { type: type, defaultValue: val.value || null, allowNull: val['allowNull'] }));
                        if (key == add_field.length - 1 && result.length == add_field.length) {
                            resolve("SUCCESS")
                        }
                    } else {
                        result.push(0)
                        if (key == add_field.length - 1 && result.length == add_field.length) {
                            resolve("SUCCESS")
                        }
                    }
                }, (err) => {
                    console.log("Incorrect Sequelize Db Details");
                    process.exit(0)
                })
            })

            var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            queryInterface.sequelize.query("UPDATE TAG SET title='First Round' WHERE title='Schedule_first_round'")
            queryInterface.sequelize.query("UPDATE TAG SET title='Second Round' WHERE title='Schedule_second_round'")
            queryInterface.sequelize.query("UPDATE TAG SET title='Third Round' WHERE title='Schedule_third_round'")
            queryInterface.sequelize.query("UPDATE TAG SET default_id=7 WHERE title='Reject'")
            queryInterface.sequelize.query("UPDATE TAG SET default_id=8 WHERE title='Selected'")
            queryInterface.sequelize.query("ALTER TABLE USER MODIFY user_type  enum('Admin','Guest','HR','Interviewee') NOT NULL;")

            queryInterface.sequelize.query("UPDATE TAG SET default_id='3' WHERE title='Shortlist'")
            queryInterface.sequelize.query("UPDATE TAG SET default_id='8' WHERE title='Reject'")
            queryInterface.sequelize.query("UPDATE TAG SET default_id='4' WHERE title='First Round'")
            queryInterface.sequelize.query("UPDATE TAG SET default_id='5' WHERE title='Second Round'")
            queryInterface.sequelize.query("UPDATE TAG SET default_id='6' WHERE title='Third Round'")
            queryInterface.sequelize.query("UPDATE TAG SET default_id='9' WHERE title='Selected'")
            queryInterface.sequelize.query("UPDATE TAG SET default_id='3' WHERE title='Shortlist'")
            queryInterface.sequelize.query("UPDATE TAG SET default_id='7' WHERE title='Hold'")
            queryInterface.sequelize.query("UPDATE TAG SET default_id='2' WHERE title='cv rejected'")
            queryInterface.sequelize.query("UPDATE TAG SET title='CV Rejected' WHERE title='cv rejected'")

            if (process.env.ENV == "dev") {
                queryInterface.sequelize.query("SELECT * FROM IMAP WHERE email='testhr69@gmail.com'").then((data) => {
                    if (data[0].length == 0) {
                        queryInterface.sequelize.query(`INSERT INTO IMAP (email, password, imap_server, server_port, type, active, createdAt, updatedAt) values('testhr69@gmail.com', 'java@123', 'imap.gmail.com', 993, 'TLS', 1 , '${date}', '${date}')`);
                    }
                })
            }
            queryInterface.sequelize.query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'examCandidate' AND COLUMN_NAME = 'examScore'").then((data) => {
                if (data[0].length == 0) {
                    queryInterface.sequelize.query("ALTER TABLE examCandidate ADD examScore INT(10) after profile_pic")
                }
            })
            queryInterface.sequelize.query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'examCandidate' AND COLUMN_NAME = 'examToken'").then((data) => {
                if (data[0].length == 0) {
                    queryInterface.sequelize.query("ALTER TABLE examCandidate ADD examToken varchar(10) after profile_pic")
                }
            })
        })
    },

    down: (queryInterface, Sequelize) => {
        return new Promise((resolve, reject) => {
            // logic for reverting the changes
            queryInterface.bulkDelete('TAG', [{ title: "Ignore" }])
            queryInterface.bulkDelete('TAG', [{ title: "Schedule" }])
        })
    }
}