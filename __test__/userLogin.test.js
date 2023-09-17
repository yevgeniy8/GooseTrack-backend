require('dotenv').config();

const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const { DB_HOST } = process.env;

describe('test login controller', () => {
    beforeAll(() => {
        mongoose.connect(DB_HOST);
    });

    afterAll(() => {
        mongoose.disconnect();
    });

    test('відповідь повина мати статус-код 200', async () => {
        const response = await supertest(app).post('/users/login').send({
            email: 'alex@gmail.com',
            password: 'qwerty',
        });

        expect(response.statusCode).toBe(200);
    });

    test('у відповіді повинен повертатися токен', async () => {
        const response = await supertest(app).post('/users/login').send({
            email: 'alex@gmail.com',
            password: 'qwerty',
        });

        expect(response.body.token).toBeTruthy();
    });

    test("у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String", async () => {
        const response = await supertest(app)
            .post('/users/login')
            .send({ email: 'alex@gmail.com', password: 'qwerty' });

        expect(typeof response.body.user.email).toBe('string');
        expect(typeof response.body.user.subscription).toBe('string');
    });
});
