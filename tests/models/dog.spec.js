const { Dog, conn } = require('../../src/db.js');
// const { expect } = require('chai');

before(async () => {
  await conn.authenticate().catch(err => console.error('Unable to connect to the database:', err));
  await conn.sync({ force: true });
});

describe('Dog model:', () => {
  describe('validators: name, height and weight.', () => {
    it('Should throw an error if any parameter is null.', done => {
      Dog.create({})
        .then(() => done(new Error('It requires a name, height and weight valid.')))
        .catch(() => done());
    });
    it('Should work if the parameters are valid.', done => {
      Dog.create({
        name: 'Pug',
        height: '36 - 46',
        weight: '6 - 8',
      })
        .then(() => done())
        .catch(() => done(new Error('It requires a name, height and weight valid.')));
    });
  });
});
