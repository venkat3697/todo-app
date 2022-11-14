const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");
let db = null;

const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, "users.db");
// Database and Server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(process.env.PORT || 8080, () => {
      console.log(` Database Connected,Server running`);
    });
  } catch (e) {
    console.log(`${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//

app.post("/register", async (req, res) => {
  const userDetails = req.body;
  const { userName, userid } = userDetails;
  const checkTableQuery = `INSERT INTO users(id,username)VALUES(${userid},'${userName}')
  ;`;
  const result = await db.run(checkTableQuery);
  const userId = result.lastID;
  res.send({ userId: userId });
});

app.get("/users", async (req, res) => {
  const getAllUsers = `SELECT * FROM users`;
  const dbResponse = await db.all(getAllUsers);
  res.send(dbResponse);
});
