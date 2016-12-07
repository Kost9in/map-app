
const pointModel = require('../model/point');
const linkModel = require('../model/link');
const getLinksToPoint = require('../lib/get-links-to-point.js');
const findPath = require('../lib/find-path.js');
const express = require('express');

const router = express.Router();

router.get('/:from/:to', (req, res) => {
  const from = req.params.from.toString();
  const to = req.params.to.toString();
  let find = 0;
  pointModel.find({}, (errPoint, points) => {
    linkModel.find({}, (errLink, links) => {
      const resultPoints = points.map(point => {
        if (point._id == from || point._id == to) {
          find++;
        }
        const result = {
          id: point._id,
          coords: point.coords,
          color: point.color,
          title: point.title,
          links: getLinksToPoint(links, point._id)
        };
        return result;
      });
      if (find === 2) {
        res.json({ path: findPath(resultPoints, from, to) });
      } else {
        res.status(404).json({ error: 'Path not found!' });
      }
    });
  });
});

module.exports = router;
