console.log("시작");

module.exports = "신기하군";

require("./var");

console.log(require.cache);
console.log(require.main === module);
console.log(require.main.filename);

console.log(
  require.cache["/Users/chohyein/Documents/study/node/javascript/3강/var.js"]
    .exports.odd
);
