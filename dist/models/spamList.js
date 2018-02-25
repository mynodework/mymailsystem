"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (sequelize, DataTypes) {
    var SpamList = sequelize.define("SpamList", {
        email: DataTypes.STRING
    }, {
        timestamps: true,
        freezeTableName: true,
        hooks: {
            beforeCreate: function beforeCreate(spamData) {
                var _this = this;

                return new Promise(function (resolve, reject) {
                    _this.findOne({ where: { email: spamData.email } }).then(function (email) {
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
};
//# sourceMappingURL=spamList.js.map