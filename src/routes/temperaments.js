const axios = require('axios');
const { Router } = require('express');
const { Temperament } = require('../db.js');

const router = Router();

router.post('/', async function (req, res) {
  let { body } = req;
  let dogs = body;
  let temperaments = [];
  try {
    if (!Object.keys(body).length) {
      temperaments = await Temperament.findAll();
      if (temperaments.length) return res.json(temperaments);
      const axiosData = await axios.get(
        'https://api.thedogapi.com/v1/breeds'
      );
      dogs = axiosData.data;
    }
    temperaments = dogs.map(dog => dog.temperament); // filtro string temperaments
    temperaments = temperaments.filter(
      temperament => temperament !== undefined
    ); // filtro campos nulos de los temperaments
    temperaments = temperaments
      .map(string => string.split(','))
      .flat()
      .map(string => string.trim().toLowerCase()); // flat convierte los subarray en un array, split convierte un string en array, trim elimina espacios al inicio y al final, toUpperCase pasa a mayúsculas
    temperaments = [...new Set(temperaments)]; // elimino temperaments repetidos
    temperaments = temperaments.map(temperament => ({
      name:
        temperament.charAt(0).toUpperCase() + temperament.slice(1),
    })); // format mas primer letra mayúscula
    if (!Object.keys(body).length) {
      await Temperament.bulkCreate(temperaments);
      temperaments = await Temperament.findAll();
    }
    res.json(temperaments);
  } catch (error) {
    res.status(404).send(`Error, no se pudo completar la operación.`);
  }
});

module.exports = router;
