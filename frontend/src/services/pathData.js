
const pathData = ($resource, config) => $resource(`${config.apiUrl}path/:from/:to`, {
  from: '@from',
  to: '@to'
});

angular.module('mapApp').factory('pathData', ['$resource', 'config', pathData]);
