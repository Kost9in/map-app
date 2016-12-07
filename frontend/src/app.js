
import config from './config';

angular.module('mapApp', ['ngResource', 'uiGmapgoogle-maps']);

angular.module('mapApp').config(['uiGmapGoogleMapApiProvider', (GoogleMapApiProviders) => {
  GoogleMapApiProviders.configure({
    key: config.googleApiKey
  });
}]);

angular.module('mapApp').constant('config', config);
