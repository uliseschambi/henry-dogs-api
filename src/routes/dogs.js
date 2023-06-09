const axios = require('axios');
var express = require('express');
var router = express.Router();
const { Dog, Temperament } = require('../db');
const { Op } = require('sequelize');
const { json } = require('body-parser');

// GET DOGS / GET DOG NAME ------------------------------------------------------------------------

router.get('/', async (req, res) => {
  const { name } = req.query;
  const { origin } = req.query;

  // DATA DE LA API

  try {
    const axiosData = await axios.get('https://api.thedogapi.com/v1/breeds');
    const dogsAPI = axiosData.data;
    const formatDogsApi = dogsAPI.map(dog => ({
      id: dog.id,
      image: dog.image.url,
      name: dog.name,
      temperament: dog.temperament,
      weight: dog.weight.metric,
    }));
    if (origin === 'api') return res.send(formatDogsApi);

    // DATA DE LA DB

    const dogsDB = await Dog.findAll({
      include: {
        model: Temperament,
        attributes: ['name'],
        through: {
          attributes: [],
        },
      },
    });
    const formatDogsDB = dogsDB.map(dog => {
      let temperament = dog.temperaments.map(temp => temp.name);
      return {
        id: dog.id,
        image: dog.image,
        name: dog.name,
        temperament: temperament.toString(),
        weight: dog.weight,
      };
    });
    if (origin === 'db') return res.send(formatDogsDB);

    // DATA DE LA API MÁS LA DB

    const dogsAll = [...formatDogsDB, ...formatDogsApi];

    // SI LLEGA LA QUERY NAME

    if (name) {
      const dogs = dogsAll.filter(dog => {
        if (dog.name.toUpperCase().includes(name.toUpperCase()))
          return {
            id: dog.id,
            name: dog.name,
            weight: dog.weight,
            temperament: dog.temperament,
            image: dog.image,
          };
      });
      if (!dogs.length) return res.status(200).send(`No existe una raza con el nombre ${name}.`);
      return res.send(dogs);
    }
    res.send(dogsAll);
  } catch (err) {
    res.status(404).send(`Error, no se pudo completar la operación.`);
  }
});

// GET DOG DETAIL ------------------------------------------------------------------------------------

router.get('/:idRaza', async function (req, res) {
  const { idRaza } = req.params;

  try {
    const axiosData = await axios.get('https://api.thedogapi.com/v1/breeds');
    const dogsAPI = axiosData.data;
    const dog = dogsAPI.find(dog => dog.id == idRaza);
    if (dog) {
      // formateo con las props de la API que voy a utilizar
      const dogFormat = {
        id: dog.id,
        name: dog.name,
        height: dog.height.metric,
        weight: dog.weight.metric,
        life_span: dog.life_span,
        temperaments: dog.temperament,
        image: dog.image.url,
      };
      return res.json(dogFormat);
    }

    const dogDB = await Dog.findByPk(idRaza, {
      include: [
        {
          model: Temperament,
          attributes: ['name'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    const dogJS = dogDB.get({ plain: true }); // JSON.parse(JSON.stringify(dogDB)); >>> obj model to obj JS
    dogJS.temperaments = dogDB.temperaments.map(t => t.name).join(', '); // Solo formateo el array de temperaments a string
    return res.json(dogJS);
  } catch (error) {
    res.status(404).send(`El id "${idRaza}" no corresponde a una raza existente.`);
  }
});

module.exports = router;

//
//
//------------------------------------------------------END------------------------------------------------------------------
// -----GET DOGS DB---------------------------------------------------------------------------------------------------------
// let dogs;
// const condition = {
//   include: {
//     model: Temperament,
//     through: {
//       attributes: [],
//     },
//   },
// }; // se agrego include a condition, revisar los tests
// const where = {};
// if (name) where.name = { [Op.iLike]: `%${name}%` }; // case insensitive mas operador LIKE SQL
// condition.where = where;
// dogs = await Dog.findAll(condition);
// if (!dogs.length) return res.status(404).send(`Error, la raza de perro no existe.`);
// return res.send(dogs);

// res.sendStatus(200); //envia solo el code
