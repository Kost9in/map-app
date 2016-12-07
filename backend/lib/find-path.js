
const getDistance = require('../lib/get-distance.js');

module.exports = (points, from, to) => {
  const ways = findNext(points, from, to, { stack: [], distance: 0, finish: false }, []);
  finishedWays = ways.filter(way => way.finish);
  finishedWays.map(way => {
    way.distance = Math.round(way.distance * 10) / 10;
    way.goto = way.stack.reduce((history, point) => {
      if (history.prev && history.prev.color.toLowerCase() !== point.color.toLowerCase()) {
        history.goto++;
      }
      history.prev = point;
      return history;
    }, { goto: 0, prev: null }).goto;
    return way;
  });
  finishedWays.sort((x, y) => {
    return x.distance - y.distance;
  });
  return finishedWays;
};

const findNext = (points, from, to, way, ways) => {
  from = from.toString();
  const activePoint = points.find(point => point.id == from);
  way = JSON.parse(JSON.stringify(way));
  way.stack.push(activePoint);
  if (from === to) {
    way.finish = true;
  }
  ways.push(way);
  if (from === to) {
    return ways;
  }
  activePoint.links.forEach(link => {
    link = link.toString();
    const tmpWay = JSON.parse(JSON.stringify(way));;
    if (!way.stack.find(one => one.id == link)) {
      tmpWay.distance += getDistance(activePoint.coords, points.find(point => point.id == link).coords);
      findNext(points, link, to, tmpWay, ways);
    }
  });
  return ways;
};
