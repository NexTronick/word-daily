const fs = require("node:fs");
const readline = require("node:readline");
const path = require("path");
const array = new Array();
async function processLineByLine() {
  const fileStream = fs.createReadStream(
    path.join(__dirname, "/words_alpha.txt")
  );

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
    array.push(line);
  }
  const store = {
    array: array,
    length: array.length,
  };
  fs.writeFile(
    path.join(__dirname, "/words.json"),
    JSON.stringify(store),
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
}

processLineByLine();
