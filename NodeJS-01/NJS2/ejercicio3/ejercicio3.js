var url = require('url');
var adr = 'http://localhost:8080/default.htm?year=2017&month=february';
var q = url.parse(adr, true);

console.log(q.host); //nos devuelve el localhost
console.log(q.pathname); //nos devuelve el path
console.log(q.search); //devuelve '?year=2017&month=february'

var qdata = q.query; //devuelve el objeto: { year: 2017, month: 'february' }
console.log(qdata.month); //nos devuelve el mes