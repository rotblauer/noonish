'use strict';
angular.module('main')
.controller('LocationCtrl', function ($scope, $log, currentLocation, MAPSTYLE, TimeFactory, RiserFactory, GeolocationFactory) {

  $log.log('LocationCtrl checking in for duty.');
  var n = 0;

  function initializeMap (position) { // init map to current location
    var styleArray = MAPSTYLE.STYLE1; // constants/mapstyle-constant.js
    $scope.map = { // Create the Google Map
      center: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      zoom: 5,
      styles: styleArray,
      options: {
        // disableDefaultUI: true
      },
      events: {
        drag: function () {
          $scope.mapMoved = true;
        }
      }
    };
    var mapIcon = 'main/assets/images/map-icon-target.png';
    $scope.marker = {
      map: $scope.map,
      idKey: '1',
      coords: $scope.map.center,
      options: {
        icon: mapIcon
      }
    };
  };
  function geoLocateHandler (position) {
    // Set location variables.
    $scope.position = position;
    $scope.error = ''; // clear error in case there was one
    $log.log('current location:', position);
    initializeMap(position);
    if ( n === 0 ) { // only do this the first time
      // getCity(position);
      // getTimeZone(position);
      // tickTock();
    }
    n += 1;
  }

  geoLocateHandler(currentLocation);

});
