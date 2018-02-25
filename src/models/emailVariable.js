export default function(sequelize, DataTypes) {
    const Variable = sequelize.define("UserVariable", {
        variableCode: DataTypes.STRING,
        variableValue: DataTypes.TEXT('long'),
    }, {
        timestamps: true,
        freezeTableName: true,
        hooks: {
            beforeCreate: function(variable) {
                return new Promise((resolve, reject) => {
                    this.findOne({ where: { variableCode: variable.variableCode } })
                        .then((email) => {
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
}