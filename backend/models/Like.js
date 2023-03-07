const {DataTypes} = require("sequelize");

const model = (sequelize) => {
    const attributes = {
        users_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        posts_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        like_type: {
            type: DataTypes.STRING,
            allowNull: true
        }
    };
    const options = {
        //
    };

    return sequelize.define("Like", attributes, options);
};

module.exports = model;