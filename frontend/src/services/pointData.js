
const pointData = ($resource, config) => $resource(`${config.apiUrl}points/:coords`);

angular.module('mapApp').factory('pointData', ['$resource', 'config', pointData]);
