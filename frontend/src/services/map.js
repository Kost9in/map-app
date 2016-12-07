
const map = function($rootScope, googleMapApi, uiGmapIsReady, config) {

  return {

    status: 'default',
    map: {},
    maps: {},
    markers: [],
    links: [],
    activeMarkerInfo: {
      title: '',
      description: ''
    },
    selectFunctions: [],
    selected: {
      from: '',
      to: ''
    },

    init() {
      return Promise.all([googleMapApi, uiGmapIsReady.promise()]).then((result) => {
        this.maps = result[0];
        this.map = result[1][0].map;
        this.map.setOptions({
          mapTypeControl: false,
          streetViewControl: false
        });
      });
    },

    setStatus(status) {
      const statuses = ['default', 'disabled', 'select'];
      if (statuses.indexOf(status) !== -1) {
        this.unselectMarkers();
        this.status = status;
      }
      if (status !== 'default') {
        this.drowSelected();
      }
    },

    addMarkers(markers) {
      markers.forEach((marker) => {
        this.addMarker(marker);
      });
      markers.forEach((marker) => {
        this.addLinks(marker);
      });
      $rootScope.$apply();
    },

    addMarker(marker) {
      const mapMarker = new this.maps.Marker({
        map: this.map,
        position: marker.coords,
        icon: {
          path: config.pointPath,
          scale: config.pointSize,
          strokeColor: marker.color,
          fillColor: marker.color,
          fillOpacity: 1
        },
        title: marker.title,
        label: '',
        color: '#FFFFFF'
      });
      mapMarker.addListener('click', this.selectMarker.bind(this, marker, mapMarker));
      this.markers.push({
        point: marker,
        mapMarker
      });
    },

    findMarker(id) {
      return this.markers.find(marker => marker.point.id === id);
    },

    addLinks(marker) {
      marker.links.forEach((link) => {
        this.addLink(marker, link);
      });
    },

    addLink(marker, link) {
      if (!this.findLink(marker.id, link)) {
        const mapLink = new this.maps.Polyline({
          map: this.map,
          path: [marker.coords, this.findMarker(link).point.coords],
          strokeColor: config.lineColor,
          strokeOpacity: 0.2,
          strokeWeight: config.lineSize
        });
        this.links.push({
          path: [marker.id, link],
          mapLink
        });
      }
    },

    findLink(from, to) {
      return this.links.find(link => link.path.indexOf(from) !== -1 && link.path.indexOf(to) !== -1);
    },

    selectMarker(marker, mapMarker) {
      if (this.status === 'default') {
        this.unselectMarkers();
        this.activeMarkerInfo.title = marker.title;
        this.activeMarkerInfo.description = marker.description;
        mapMarker.setIcon({
          path: config.pointPath,
          scale: config.pointSize * 1.5,
          strokeColor: marker.color,
          fillColor: marker.color,
          fillOpacity: 1
        });
        marker.links.forEach(link => {
          this.findLink(marker.id, link).mapLink.setOptions({ strokeOpacity: 1 });
        });
      } else {
        this.selectFunctions.forEach(func => func('marker', marker));
      }
      $rootScope.$$phase || $rootScope.$apply();
    },

    unselectMarkers() {
      this.activeMarkerInfo.title = '';
      this.activeMarkerInfo.description = '';
      this.markers.forEach(marker => {
        marker.mapMarker.setIcon({
          path: config.pointPath,
          scale: config.pointSize,
          strokeColor: marker.point.color,
          fillColor: marker.point.color,
          fillOpacity: 1
        });
        marker.mapMarker.setLabel('');
      });

      this.links.forEach(link => link.mapLink.setOptions({ strokeOpacity: 0.2 }));
      $rootScope.$$phase || $rootScope.$apply();
    },

    mapClick(lat, lng) {
      if (this.status === 'default') {
        this.unselectMarkers();
      } else if (this.status === 'select') {
        this.selectFunctions.forEach(func => func('map', { lat, lng }));
      }
    },

    setSelected(type, id) {
      this.selected[type] = id;
      this.drowSelected();
    },

    drowSelected() {
      this.unselectMarkers();
      if (this.selected.from) {
        const marker = this.findMarker(this.selected.from);
        marker.mapMarker.setIcon({
          path: config.pointPath,
          scale: config.pointSize * 1.5,
          strokeColor: marker.point.color,
          fillColor: marker.point.color,
          fillOpacity: 1
        });
        marker.mapMarker.setLabel({
          text: 'A',
          color: config.labelColor
        });
      }
      if (this.selected.to) {
        const marker = this.findMarker(this.selected.to);
        marker.mapMarker.setIcon({
          path: config.pointPath,
          scale: config.pointSize * 1.5,
          strokeColor: marker.point.color,
          fillColor: marker.point.color,
          fillOpacity: 1
        });
        marker.mapMarker.setLabel({
          text: 'B',
          color: config.labelColor
        });
      }
    },

    drowPath(list) {
      this.drowSelected();
      if (list) {
        list.reduce((prev, current) => {
          if (prev) {
            const link = this.findLink(prev.id, current.id);
            link.mapLink.setOptions({ strokeOpacity: 1 })
          }
          return current;
        }, null);
      } else {
        this.activeMarkerInfo.title = '';
        this.activeMarkerInfo.description = '';
      }
    },

    showPointInPath(list, point) {
      this.drowPath(list);
      const marker = this.findMarker(point);
      this.activeMarkerInfo.title = marker.point.title;
      this.activeMarkerInfo.description = marker.point.description;
      marker.mapMarker.setIcon({
        path: config.pointPath,
        scale: config.pointSize * 1.5,
        strokeColor: marker.point.color,
        fillColor: marker.point.color,
        fillOpacity: 1
      });
    }

  };

}

angular.module('mapApp').factory('map', ['$rootScope', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'config', map]);
