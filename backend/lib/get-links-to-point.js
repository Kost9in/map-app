
module.exports = (links, point) => links.filter(link => link.links.indexOf(point) !== -1)
  .map(link => link.links[Math.abs(link.links.indexOf(point) - 1)]);
