const dns = require("dns/promises");

// ip주소
const a = await dns.resolve("gilbut.co.kr", "A");

// 메일 서버
const mx = await dns.resolve("gilbut.co.kr", "MX");

// www를 붙여도 동일한 도메인으로 연결하기 (별명)
const cname = await dns.resolve("www.gilbut.co.kr", "CNAME");
