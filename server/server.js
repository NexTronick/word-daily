require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const { randomWordwithDictionary } = require("./controller/word");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "https://nextronick.github.io/word-of-the-day/",
    methods: ["GET", "POST"],
  })
);

app.get("/word-random", randomWordwithDictionary);

app.listen(PORT, () => {
  console.log("listening to http://localhost:" + PORT);
});
