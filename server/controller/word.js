const https = require("node:https");
const fsp = require("fs").promises;
const path = require("path");
let data = null;

function randomIndex(max) {
  return Math.floor(Math.random() * max);
}

//returns promise of word search
function getRandomWordWithDictionary(newData) {
  return new Promise((resolve, reject) => {
    let word = newData.array[randomIndex(newData.length)];

    https.get(process.env.DICTIONARY_API + word, (res) => {
      let resData = [];
      res.on("data", (chunk) => {
        resData.push(chunk);
      });
      res.on("end", () => {
        let finalData = JSON.parse(Buffer.concat(resData).toString());

        if (finalData) resolve(finalData);
      });
      res.on("error", (err) => {
        console.log(err);
        reject(finalData);
      });
    });
  });
}

//gets a valid word
async function getProperRandomWord(newData) {
  let word = await getRandomWordWithDictionary(newData);
  let correctWord = false;
  console.log("old word: " + JSON.stringify(word));
  while (!correctWord) {
    if (word.message != undefined) {
      word = await getRandomWordWithDictionary(newData);
      console.log("new word: " + JSON.stringify(word));
      continue;
    }
    correctWord = true;
  }
  return word;
}

//write to data variable
async function writeData() {
  if (data != null) {
    return data;
  }
  console.log("start " + Date.now());
  let file = await fsp.readFile(
    path.join(__dirname, process.env.STORAGE_WORDS)
  );
  console.log("end " + Date.now());
  data = JSON.parse(file.toString());
  console.log(data);
  return data;
}

async function randomWordwithDictionary(req, res) {
  try {
    let newData = await writeData();
    let wordDictionary = await getProperRandomWord(newData);
    res.send(wordDictionary);
    res.end();
  } catch (e) {
    console.log(e);
    res.send(e.message);
    res.end();
  }
}

module.exports = {
  randomWordwithDictionary: randomWordwithDictionary,
};
