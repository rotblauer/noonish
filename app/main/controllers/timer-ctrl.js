'use strict';
angular.module('main')
.controller('TimerCtrl', function ($scope, $log, $timeout, $cordovaGeolocation, TimeFactory) {

    // Initialize variables.
    $scope.lat;
    $scope.lng;
    $scope.map;
    $scope.accuracy ;
    $scope.error = '';

    // Initialize result function in case of error.
    $scope.showResult = function() {
      return $scope.error === '';
    };

    $scope.initializeMap = function (position) {

      var styleArray = [
        {
          featureType: "all",
          stylers: [
            { saturation: -80 }
          ]
        },{
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [
            { hue: "#00ffee" },
            { saturation: -50 }
          ]
        },{
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [
            // { hue: "#00ffee" },
            { saturation: -50 }
          ]
        },{
          featureType: "poi.business",
          elementType: "labels",
          stylers: [
            { visibility: "off" }
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
      $scope.meanTime = TimeFactory.getMeanSolar(lon);
    };

    $scope.trueTimer = function (position) {
      var lon = position.coords.longitude;
      $scope.trueTime = TimeFactory.getTrueSolar(lon);
    };

    $scope.handlePosition = function(position) {
      // Set location variables.
      $scope.lat = position.coords.latitude;
      $scope.lng = position.coords.longitude;
      $scope.accuracy = position.coords.accuracy;
      $scope.initializeMap(position);
      $scope.meanTimer(position); // get mean local
      $scope.trueTimer(position); // get true local
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

    // called through button
    $scope.getLocation = function() {
      if ($cordovaGeolocation) { // If the plugin is there and working
        var posOptions = {
          timeout: 10000,
          enableHighAccuracy: true
        };
        $cordovaGeolocation.getCurrentPosition(posOptions)
          .then(
            $scope.handlePosition, // success
            $scope.showError // error
          );
      } else { // otherwise shi
        $scope.error = 'Geolocation is not supported by this browser.';
      }
    };

    $scope.getLocation();

    var clockIt = function() {
      $scope.clock = new Date();
      // Set the clock time.

      // Update location.
      $scope.getLocation();
      // Tick.
      $timeout(clockIt, 1000);
    };
    $timeout(clockIt, 1000);

});
