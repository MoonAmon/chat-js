const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('chatroom', 'postgres', 'IV@3U5W#Bp7YEu', {
    host: 'chatroom.database.windows.net',
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: false
        }
    },
    logging: true
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

sequelize.sync({ force: true }).then(() => {
    console.log('Database & tables created!');
});

module.exports = { sequelize, connectDB };