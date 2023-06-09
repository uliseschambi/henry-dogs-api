/* eslint-disable import/no-extraneous-dependencies */
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Temperament, Dog, conn } = require('../../src/db.js');
const expect = require('chai').expect;

const agent = session(app);

describe('Dogs routes:', () => {
  before(async () => {
    await conn.authenticate().catch(err => console.error('Unable to connect to the database:', err));
    await conn.sync({ force: true });
    await Dog.create({
      name: 'Odie',
      height: '10 - 15',
      weight: '3 - 4',
      life_span: '5 - 10 years',
    });
    await Dog.create(
      {
        name: 'Dog Patán',
        height: '20 - 30',
        weight: '5 - 6',
        life_span: '8 - 13 years',
        temperaments: [{ name: 'playfull' }, { name: 'guardian' }],
      },
      {
        include: Temperament,
      }
    );
    await Dog.create({
      name: 'Droopy dog',
      height: '16 - 26',
      weight: '4 - 5',
      life_span: '15 - 20 years',
    });
  });

  describe('GET /dogs', () => {
    xit('should get 200', async () => {
      const res = await agent.get('/dogs');
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.eql([
        {
          name: 'Odie',
          height: '10 - 15',
          weight: '3 - 4',
          life_span: '5 - 10 years',
        },
        {
          name: 'Dog Patán',
          height: '20 - 30',
          weight: '5 - 6',
          life_span: '8 - 13 years',
        },
        {
          name: 'Droopy dog',
          height: '16 - 26',
          weight: '4 - 5',
          life_span: '15 - 20 years',
        },
      ]);
    });

    xit('Should list all dogs that match with the name filter.', async () => {
      const res = await agent.get('/dogs?name=dog');
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.eql([
        {
          name: 'Dog Patán',
          height: '20 - 30',
          weight: '5 - 6',
          life_span: '8 - 13 years',
        },
        {
          name: 'Droopy dog',
          height: '16 - 26',
          weight: '4 - 5',
          life_span: '15 - 20 years',
        },
      ]);
    });

    it('Should return 404 status and correct message if idRaza is invalid.', async () => {
      const res = await agent.get('/dogs/0');
      expect(res.statusCode).to.equal(404);
      expect(res.text).to.equal(`El id "0" no corresponde a una raza existente.`);
    });

    xit('Should return the correct dog search by idRaza.', async () => {
      const res = await agent.get('/dogs/1');
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.eql({
        name: 'Odie',
        height: '10 - 15',
        weight: '3 - 4',
        life_span: '5 - 10 years',
        temperaments: [],
      });
    });
  });
});
