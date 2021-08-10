const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, './');
dotenv.config({path: root('.env')});

module.exports = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    DESTINATION: 'uploads'
}