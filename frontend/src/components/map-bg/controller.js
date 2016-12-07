
class mapBg {
  constructor(map, config) {

    this.center = config.mapCenter;
    this.zoom = config.mapZoom;
    this.events = {
      click(eventMap, eventName, event) {
        map.mapClick(event[0].latLng.lat(), event[0].latLng.lng());
      }
    };

  }
}

angular.module('mapApp').controller('mapBg', ['map', 'config', mapBg]);
