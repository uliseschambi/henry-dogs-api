const server = require("./src/app.js");
const { conn } = require("./src/db.js");

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  console.log("Synchronized models.");
  server.listen(3000, () => {
    console.log("Listening at 3000."); // eslint-disable-line no-console
  });
});
