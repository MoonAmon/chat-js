const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const User = require('./user');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true
});

// Define associations
Message.belongsTo(User, {
    foreignKey: {
        name: 'author',
        allowNull: false
    },
    as: 'user',
    onDelete: 'CASCADE'
});

// Sync model
sequelize.sync({ alter: true }).then(() => {
    console.log('Message model synced');
});

module.exports = Message;