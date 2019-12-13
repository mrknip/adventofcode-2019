const fs = require('fs');
const data = fs.readFileSync('./data.txt', 'utf8');

function main() {
  console.log({data});
}


module.exports = {};
