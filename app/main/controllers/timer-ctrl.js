'use strict';
angular.module('main')
.controller('TimerCtrl', function ($scope, $log, $timeout, $cordovaGeolocation, TimeFactory, RiserFactory, GeolocationFactory) {

    // Initialize variables.
    $scope.lat;
    $scope.lng;
    $scope.map;
    $scope.accuracy ;
    $scope.error = '';
    var n = 0;

    $scope.x = {};
    $scope.x.dst;

    $scope.addressMode = true;

    $scope.changeAddressMode = function () {
      if ( $scope.addressMode ) {
        $scope.addressMode = false;
      } else {
        $scope.addressMode = true;
      }
    }


    // Initialize result function in case of error.
    $scope.showResult = function() {
      return $scope.error === '';
    };

    $scope.initializeMap = function (position) {

      var styleArray = [
  {
    "featureType": "road.highway",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "road.arterial",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "road.local",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "administrative.locality",
    "stylers": [
      { "visibility": "simplified" }
    ]
  },{
    "featureType": "water",
    "stylers": [
      { "color": "#87d5dd" }
    ]
  },{
    "featureType": "landscape.man_made",
    "stylers": [
      { "saturation": 29 },
      { "lightness": 17 },
      { "gamma": 0.81 }
    ]
  }
];

      // Create the Google Map
      $scope.map = {
        center: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        zoom: 10,
        styles: styleArray,
        options: {
          disableDefaultUI: true
        }
      };
    };

    $scope.meanTimer = function (position) {
      var lon = position.coords.longitude;
      $scope.meanTime = TimeFactory.getMeanSolar(lon, $scope.x.dst);
    };

    $scope.trueTimer = function (position) {
      var lon = position.coords.longitude;
      $scope.trueTime = TimeFactory.getTrueSolar(lon, $scope.x.dst);
    };

    $scope.handlePosition = function(position) {

      // Set location variables.
      $scope.lat = position.coords.latitude;
      $scope.lng = position.coords.longitude;
      $scope.accuracy = position.coords.accuracy;
      $scope.initializeMap(position);
      $scope.meanTimer(position); // get mean local
      $scope.trueTimer(position); // get true local
      $scope.diffMeanClock = RiserFactory.timeString(TimeFactory.diffMeanClock($scope.lng));
      $scope.diffTrueClock = RiserFactory.timeString(TimeFactory.diffTrueClock($scope.lng));

      if ( n === 0 ) {
        setCity(position);
      }

      n += 1; // index counter
    };

    $scope.showError = function(error) {
      switch (error.code) {
      // da fuck does this work?
      case error.PERMISSION_DENIED:
        $scope.error = 'User denied the request for Geolocation.';
        break;
      case error.POSITION_UNAVAILABLE:
        $scope.error = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        $scope.error = 'The request to get user location timed out.';
        break;
      case error.UNKNOWN_ERROR:
        $scope.error = 'An unknown error occurred.';
        break;
      }
      // $scope.$apply();
    };

    function setCity (position) {
      GeolocationFactory.getNearByCity($scope.lat, $scope.lng)
        .then(function (data) {
          $log.log('nearByCity data', data);
          $scope.nearestCity = data.data.results[0]['formatted_address'];
        });
    }

    $scope.getAndUpdateLocation = function () {
      GeolocationFactory.getLocation()
        .then($scope.handlePosition, $scope.showError);
    };

    // function initLocation () {
    //   GeolocationFactory.getLocation()
    //     .then(setCity, $scope.showError);
    //   $scope.getAndUpdateLocation();
    // }

    // initLocation();


    var clockIt = function() {
      $scope.clock = new Date();
      // Set the clock time.

      // Update location.
      $scope.getAndUpdateLocation();
      // Tick.
      $timeout(clockIt, 1000);
    };
    $timeout(clockIt, 1000);

});
