require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./app');

const { DB_HOST } = process.env;

mongoose
    .connect(DB_HOST)
    .then(console.log('Database connection successful'))
    .then(() => {
        app.listen(8000, () => {
            console.log('Server running. Use our API on port: 8000');
        });
    })
    .catch(error => {
        console.log(error);
        process.exit(1);
    });
