const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const port = process.env.PORT || 3001;

// Syncing all the models at once.
conn.sync({ alter: true }).then(() => {
  console.log('Synchronized models.');
  server.listen(port, () => {
    // server.listen(port, '0.0.0.0', () => {
    console.log('Listening at ', port); // eslint-disable-line no-console
  });
});
