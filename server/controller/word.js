const https = require("node:https");
const fs = require("fs");
const path = require("path");
let data = null;

function randomIndex(max) {
  return Math.floor(Math.random() * max);
}

async function randomWord(callback) {
  if (data != null) {
    getDictionary(data.array[randomIndex(data.length)], callback);
  }

  await fs.readFile(
    path.join(__dirname, process.env.STORAGE_WORDS),
    (err, data) => {
      if (err) {
        console.log(err);
      }
      data = JSON.parse(data.toString());
      let word = data.array[randomIndex(data.length)];
      console.log(word);
      getDictionary(word, callback);
    }
  );
}

async function getDictionary(word, callback) {
  await https.get(process.env.DICTIONARY_API + word, (res) => {
    let data = [];
    res.on("data", (chunk) => {
      data.push(chunk);
    });
    res.on("end", () => {
      let finalData = JSON.parse(Buffer.concat(data).toString());
      callback(finalData);
    });
    res.on("error", (err) => {
      console.log(err);
      callback(err);
    });
  });
}

async function randomWordwithDictionary(req, res) {
  await randomWord((data) => {
    res.status(200);
    res.send(data);
    res.end();
  });
}

module.exports = {
  randomWordwithDictionary: randomWordwithDictionary,
};
