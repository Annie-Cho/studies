const fs = require("fs").promises;

async function main() {
  let data = await fs.readFile("./readme.txt");
  console.log("1번", data.toString());
  data = await fs.readFile("./readme.txt");
  console.log("1번", data.toString());
  data = await fs.readFile("./readme.txt");
  console.log("1번", data.toString());
  data = await fs.readFile("./readme.txt");
  console.log("1번", data.toString());
}

/*
fs.readFile("./readme.txt")
  .then((data) => {
    console.log("1번", data.toString());
  })
  .then((data) => {
    console.log("2번", data.toString());
  })
  .then((data) => {
    console.log("3번", data.toString());
  })
  .catch((err) => {
    throw err;
  });
*/
