const {DataTypes} = require("sequelize");

const model = (sequelize) => {
    const attributes = {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                // is:
            }
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: {
            //     is: /^[0-9a-f]{64}$/i
            // }
        }    
    };
    const options = {
        //
    };

    return sequelize.define("user", attributes, options);
};

module.exports = model;