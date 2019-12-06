function getMap(array) {
  let map = {};

  array.forEach((orbit, i) => {
    const [ orbited, orbiter ] = orbit.split(')');

    map[orbited] = map[orbited] ? map[orbited] : ({ children: [] });
    map[orbited].children = map[orbited].children || [];
    map[orbited].children = [ ...map[orbited].children, orbiter ];

    map[orbiter] = map[orbiter] ? { ...map[orbiter], parent: orbited} : ({ parent: orbited })
  });

  return map
}

function hasChild (map, parentNodeName, targetNodeName) {
  const parentNode = map[parentNodeName];
  if (!parentNode.children) return;
  let foundChild = false;

    if (parentNode.children.includes(targetNodeName)) foundChild = true;

    if (!foundChild) {
      foundChild = !!parentNode.children.find(childName => hasChild(map, childName, targetNodeName));
    }

  return foundChild;
}

function getAncestors(map, nodeName, out = []) {
  const node = map[nodeName]
  if (!node.parent) return out;

  out.push(node.parent);

  return getAncestors(map, node.parent, out);
}


function getSharedAncestors(map, targetNodeA, targetNodeB) {
  const ancestorsA = getAncestors(map, targetNodeA);
  const ancestorsB = getAncestors(map, targetNodeB);

  return [...ancestorsA.filter(aValue => new Set(ancestorsB).has(aValue)) ];
  return ancestors
}


function getShortestDistance(map, targetNodeA, targetNodeB) {
  const ancestorsA = getAncestors(map, targetNodeA);
  const ancestorsB = getAncestors(map, targetNodeB);
  const closestAncestor = getSharedAncestors(map, targetNodeA, targetNodeB)[0];

  const distanceA = ancestorsA.indexOf(closestAncestor) + 1;
  const distanceB = ancestorsB.indexOf(closestAncestor) + 1;

  return distanceA + distanceB;
}

function getMapChecksum(input) {
  const map = getMap(input);

  for (let nodeName in map) {
    tagDepths(nodeName, map);
  }

  return Object.values(map).reduce((sum, node) => sum + node.depth, 0);
}

function tagDepths(nodeName, map) {
  map[nodeName].depth = map[nodeName].depth || 0;

  if (!map[nodeName].children) return;

  map[nodeName].children.forEach((childNodeName) => {
    if (map[childNodeName]) {
      map[childNodeName].depth = map[childNodeName].depth ? map[childNodeName].depth + 1 : 1;
    }

    tagDepths(childNodeName, map);
  })
}
module.exports = {
  getMap,
  getMapChecksum,
  hasChild,
  getSharedAncestors,
  getShortestDistance,
}
