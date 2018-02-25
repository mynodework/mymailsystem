export default function(sequelize, DataTypes) {
    const SpamList = sequelize.define("SpamList", {
        email: DataTypes.STRING
    }, {
        timestamps: true,
        freezeTableName: true,
        hooks: {
            beforeCreate: function(spamData) {
                return new Promise((resolve, reject) => {
                    this.findOne({ where: { email: spamData.email } })
                        .then((email) => {
                            if (email) {
                                reject("contact is Already Added");
                            } else {
                                resolve();
                            }
                        });
                });
            }
        }
    });

    return SpamList;
}