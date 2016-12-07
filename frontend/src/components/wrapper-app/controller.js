
class wrapperApp {

  constructor(pointData, map) {

    this.loader = true;
    this.error = '';
    this.activeMarkerInfo = map.activeMarkerInfo;

    pointData.get().$promise.then((result) => {
      if (map) {
        map.init().then(() => {
          this.loader = false;
          map.addMarkers(result.points);
        }, () => this.error = 'Произошла ошибка при инициализации карты.');
      } else {
        this.error = 'Произошла ошибка при инициализации карты.';
      }
    }, () => this.error = 'Произошла ошибка при загрузке данных.');

  }

}

angular.module('mapApp').controller('wrapperApp', ['pointData', 'map', wrapperApp]);
