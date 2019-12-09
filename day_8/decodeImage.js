const fs = require('fs');
const { decodeImage } = require('./index');

const fileName = process.argv[2];
const width = process.argv[3];
const height = process.argv[4];

console.log({fileName});

const image = fs.readFileSync(fileName, 'utf8');



console.log(decodeImage(image, +width, +height));

// let height = 0;
// let width = 0;
// let dir = 1;
// let wDir = 1;
// setInterval(() => {
//
//   wDir = width === 0 ? 1 : width === 25 ? -1 : wDir;
//
//   if (height === 10) {
//     dir = -1;
//   } else if (height === 0) {
//     dir = 1;
//   }
//
//   height += dir;
//   width += wDir;
//   console.log({wDir, height, width});
//
//   process.stdout.write('\033c');
//   console.log(decodeImage(image, width, height));
//
// }, 50)
