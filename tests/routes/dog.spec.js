/* eslint-disable import/no-extraneous-dependencies */
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Temperament, Dog, conn } = require('../../src/db.js');
const expect = require('chai').expect;

const agent = session(app);

describe('Dog routes:', () => {
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

  describe('POST /dog:', () => {
    it('Should returns status 404 and its corresponding text if the mandatory parameters are not sent.', async () => {
      const res = await agent.post('/dog');
      expect(res.statusCode).to.equal(404);
      expect(res.text).to.equal('Falta enviar datos obligatorios.');
    });
    xit('Should return status 201 and object dog if dog was created correctly.', async () => {
      const res = await agent.post('/dog').send({
        name: 'Pluto',
        height: '26 - 36',
        weight: '6 - 7',
        life_span: '10 - 12 years',
      });
      expect(res.statusCode).to.equal(201);
      expect(res.body).to.eql({
        name: 'Pluto',
        height: '26 - 36',
        weight: '6 - 7',
        life_span: '10 - 12 years',
      }); // eql por que los objetos nunca van a ser iguales.
    });
    it('Should return status 404 and the corresponding text if the creation of the record in the database failed.', async () => {
      const res = await agent.post('/dog').send({
        id: 'string',
        name: 'Pluto',
        height: '26 - 36',
        weight: '6 - 7',
      });
      expect(res.statusCode).to.equal(404);
      expect(res.text).to.equal('Error en algunos de los datos provistos.');
    });
  });
});
