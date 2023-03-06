const {DataTypes} = require("sequelize");

const model = (sequelize) => {
    const attributes = {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        imgUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        }

        // Relations : voir https://sequelize.org/docs/v6/core-concepts/assocs/
    };
    const options = {

    };

    return sequelize.define("post", attributes, options);
};

module.exports = model;