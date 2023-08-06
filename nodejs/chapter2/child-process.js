const exec = require("child_process").exec;

var process = exec("dir");

// 콘솔 창에서 dir 시 출력되는 결과 데이터
process.stdout.on("data", function (data) {
  console.log(data.toSting());
});

// 콘솔 창에서 dir 후 에러발생 시 결과 데이터
process.stderr.on("data", function (data) {
  console.error(data.toSting());
});
