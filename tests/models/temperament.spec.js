const { Temperament, conn } = require('../../src/db.js');

before(async () => {
  await conn.authenticate().catch(err => console.error('Unable to connect to the database:', err));
  await conn.sync({ force: true });
});

describe('Temperament model:', () => {
  describe('validator: name.', () => {
    it('It should throw an error if name is null.', async () => {
      var nameError = new TypeError('It requires a valid name.');
      try {
        await Temperament.create({}); // TypeError no atrapa el error. Error atrapa el error
        throw nameError;
      } catch (error) {
        if (error instanceof TypeError) throw nameError;
        return; // no es necesario
      }
    });

    it('It should work if the name is valid.', async () => {
      try {
        await Temperament.create({ name: 'strong' });
      } catch {
        throw new TypeError('It requires a valid name.');
      }
    });
  });
});
