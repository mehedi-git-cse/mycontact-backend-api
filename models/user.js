const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    mongo_id: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.INTEGER,
    },
    is_archived: {
        type: DataTypes.INTEGER,
    },
    image: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'users', // Map explicitly to the users table
    timestamps: false, // Disable `createdAt` and `updatedAt` fields
});

module.exports = User;
