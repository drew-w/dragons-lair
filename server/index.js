require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const authCtrl = require("./controllers/authController");
const treasureCtrl = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware");

const PORT = 4000;

const app = express();

const { SESSION_SECRET, CONNECTION_STRING } = process.env;

app.use(express.json());

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 },
  })
);

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
})
  .then((db) => {
    app.set("db", db);
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    console.log("db connected");
  })
  .catch((err) => console.log(err));

app.post("/auth/register", authCtrl.register);
app.post("/auth/login", authCtrl.login);
app.get("/auth/logout", authCtrl.logout);

app.get("/api/treasure/dragon", treasureCtrl.dragonTreasure);
app.get("/api/treasure/user", auth.usersOnly, treasureCtrl.getUserTreasure);
app.post("/api/treasure/user", auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)
