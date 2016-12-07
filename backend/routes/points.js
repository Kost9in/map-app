
const pointModel = require('../model/point');
const linkModel = require('../model/link');
const getDistance = require('../lib/get-distance.js');
const getLinksToPoint = require('../lib/get-links-to-point.js');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  pointModel.find({}, (errPoint, points) => {
    linkModel.find({}, (errLink, links) => {
      const resultPoints = points.map(point => {
        const result = {
          id: point._id,
          coords: point.coords,
          color: point.color,
          title: point.title,
          description: point.description,
          links: getLinksToPoint(links, point._id)
        };
        return result;
      });
      res.json({ points: resultPoints });
    });
  });
});

router.get('/:coords', (req, res) => {
  const coordsArray = req.params.coords.split(',');
  const coords = {
    lng: coordsArray[0],
    lat: coordsArray[1]
  };
  let closePoint, distance;
  pointModel.find({}, (errPoint, points) => {
    points.forEach(point => {
      getDistance(point.coords, coords);
      if (!closePoint) {
        closePoint = point;
        distance = getDistance(coords, point.coords);
      } else {
        const newDistance = getDistance(coords, point.coords);
        if (newDistance < distance) {
          distance = newDistance;
          closePoint = point;
        }
      }
    });
    res.json(closePoint);
  });
});

module.exports = router;
