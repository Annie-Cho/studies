const fs = require("fs").promises;

fs.writeFile("./writeme.txt", "글을 써주sayYo")
  .then(() => {
    return fs.readFile("./writeme.txt");
  })
  .then((data) => {
    console.log(data);
    console.log(data.toString());
  })
  .catch((err) => {});
