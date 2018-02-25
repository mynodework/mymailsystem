"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (sequelize, DataTypes) {
    var Variable = sequelize.define("UserVariable", {
        variableCode: DataTypes.STRING,
        variableValue: DataTypes.TEXT('long')
    }, {
        timestamps: true,
        freezeTableName: true,
        hooks: {
            beforeCreate: function beforeCreate(variable) {
                var _this = this;

                return new Promise(function (resolve, reject) {
                    _this.findOne({ where: { variableCode: variable.variableCode } }).then(function (email) {
                        if (email) {
                            reject("Variable is Already Added");
                        } else {
                            resolve();
                        }
                    });
                });
            }
        }
    });
    return Variable;
};
//# sourceMappingURL=emailVariable.js.map