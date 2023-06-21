const server = require("./src/app.js");
const { conn } = require("./src/db.js");

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  console.log("Synchronized models.");
  server.listen(80, () => {
    console.log("Listening at 80."); // eslint-disable-line no-console
  });
});
