const fs = require('fs');
const { decodeImage } = require('./index');

const fileName = process.argv[2];
const width = process.argv[3];
const height = process.argv[4];

console.log({fileName});

const image = fs.readFileSync(fileName, 'utf8');



console.log(decodeImage(image, +width, +height));
