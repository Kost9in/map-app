
class leftSidebar {

  constructor(pointData, pathData, map) {

    this.open = localStorage.leftSidebar === 'true';
    this.markers = map.markers;
    this.tab = 0;
    this.from = '';
    this.to = '';
    this.pathList = [];
    this.activePointToPath = '';

    map.selectFunctions.push((type, object) => {
      const set = (target) => {
        if (this.tab === 1) {
          this.from = target;
          this.changeSelect('from');
        } else if (this.tab === 2 && this.from !== target) {
          this.to = target;
          this.changeSelect('to');
        } else if (this.tab === 4) {
          this.showPointInPath(target);
        }
      };
      if (type === 'map') {
        this.loader = true;
        pointData.get({coords: `${object.lng},${object.lat}`}).$promise.then((result) => {
          this.loader = false;
          set(result._id);
        }, () => this.error = 'Произошла ошибка при загрузке данных.');
      } else {
        set(object.id);
      }
    });

    this.toggleOpen = () => {
      this.open = !this.open;
      localStorage.leftSidebar = this.open;
    };

    this.toStep = (step) => {
      if (step === 0) {
        map.setStatus('default');
        this.from = this.to = '';
        this.pathList = [];
        map.setSelected('from', '');
        map.setSelected('to', '');
      } else if (step === 1) {
        map.setStatus('select');
        this.to = '';
        map.setSelected('to', '');
      } else if (step === 2) {
        map.setStatus('select');
      } else if (step === 3) {
        map.setStatus('disabled');
        if (this.tab !== 4) {
          this.loader = true;
          pathData.get({from: this.from, to: this.to}).$promise.then((result) => {
            this.loader = false;
            this.pathList = result.path;
          }, () => this.error = 'Произошла ошибка при загрузке данных.');
        }
      } else if (step === 4) {
        map.setStatus('disabled');
      }
      this.tab = step;
    }

    this.changeSelect = (type) => {
      map.setSelected(type, this[type]);
    };

    this.showPath = (index) => {
      this.activePointToPath = '';
      this.activePath = index;
      this.toStep(4);
      map.drowPath(this.pathList[this.activePath].stack);
    }

    this.backToPathList = () => {
      this.toStep(3);
      map.drowPath(null);
    };

    this.showPointInPath = (id) => {
      const stack = this.pathList[this.activePath].stack;
      if (stack.find(point => point.id == id)) {
        this.activePointToPath = id;
        map.showPointInPath(stack, id);
      }
    };

  }

  getPoint(step) {
    const marker = this.markers.find(marker => marker.point.id === this[step]);
    return (marker) ? marker.point : {};
  }

}

angular.module('mapApp').controller('leftSidebar', ['pointData', 'pathData', 'map', leftSidebar]);
