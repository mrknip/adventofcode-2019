function getAsteroidCount(gridData, point) {
  const [x,y] = point;
  grid = gridData.split('\n').map(row => row.split(''));

  console.log({grid});
}

module.exports = {
  getAsteroidCount,
}
