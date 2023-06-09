const express = require('express');
const router = express.Router();
const { Dog } = require('../db');
const { Temperament } = require('../db.js');

router.post('/', async function (req, res) {
  const { name, height, weight, life_span, image, temperaments } = req.body;

  try {
    if (!name || !height || !weight || !temperaments.length) return res.status(404).send('Falta enviar datos obligatorios.');
    const temperamentsDB = await Temperament.findAll({
      where: {
        name: temperaments,
      },
    });
    if (!temperamentsDB.length) return res.status(404).send('Error en los temperamentos provistos.');

    const dog = await Dog.create({ name, height, weight, life_span, image });
    await dog.addTemperaments(temperamentsDB);
    return res.status(201).json(dog);
  } catch {
    return res.status(404).send('Error en algunos de los datos provistos.');
  }
});

module.exports = router;
