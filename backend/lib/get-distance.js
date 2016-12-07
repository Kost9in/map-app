
module.exports = (from, to) => {
  const R = 6378137;
  const dLat = rad(to.lat - from.lat);
  const dLong = rad(to.lng - from.lng);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(from.lat)) * Math.cos(rad(to.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c / 1000);
};

const rad = (x) => {
  return x * Math.PI / 180;
};
