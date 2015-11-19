'use strict';
angular.module('main')
.controller('SunnyCtrl', function ($scope, $log, $cordovaGeolocation, TimeFactory, RiserFactory, GeolocationFactory) {

  $scope.jDay = TimeFactory.cardinalDay();
  $scope.eot = TimeFactory.equationOfTime();
  $scope.eotf = TimeFactory.formatEOT();

  $scope.eotff = RiserFactory.timeString(TimeFactory.equationOfTime());
  // $scope.eotff = RiserFactory.timeString(-);

  var d = new Date();
  $scope.day = d.getDate();
  $scope.month = d.getMonth();
  $scope.year = d.getFullYear();

  $scope.JD = RiserFactory.getJD($scope.day, $scope.month, $scope.year); // (day, month, year)
  $scope.timeJulianCent = RiserFactory.calcTimeJulianCent($scope.JD);
  $scope.nearestCity;


  // $scope.dst = false;
  $scope.x = {};
  $scope.x.dst = false;

  function morning (lat, lng, tz) {
    var lat = lat;
    var lon = lng;
    var tz = tz;
    var dst = $scope.x.dst;
    $scope.sunrise = RiserFactory.calcSunriseSet(1, $scope.JD, lat, lon, tz, dst); // rise[1:morn, 0:eve], JD, latitude, longitude, timezone, dst
  }
  function evening (lat, lng, tz) {
    var lat = lat;
    var lon = lng;
    var tz = tz;
    var dst = $scope.x.dst;
    $scope.sunset = RiserFactory.calcSunriseSet(0, $scope.JD, lat, lon, tz, dst); // rise[1:morn, 0:eve], JD, latitude, longitude, timezone, dst
  }

  $scope.handlePosition = function(position) {
    $log.log('position:', position);
    $scope.error = null;
    // Set location variables.
    $scope.lat = position.coords.latitude;
    $scope.lng = position.coords.longitude;
    if ( $scope.lng < 0 ) {
      $scope.timezone = new Date().getTimezoneOffset() / -60;
    } else {
      $scope.timezone = new Date().getTimezoneOffset() / 60;
    }

    morning($scope.lat, $scope.lng, $scope.timezone);
    $scope.noon = RiserFactory.solarNoon($scope.JD, $scope.lng, $scope.timezone, $scope.x.dst);
    evening($scope.lat, $scope.lng, $scope.timezone);

    setCity(position);
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
  };

  function setCity (position) {
    GeolocationFactory.getNearByCity($scope.lat, $scope.lng)
      .then(function (data) {
        $log.log('nearByCity data', data);
        $scope.nearestCity = data.data.results[0]['formatted_address'];
      });
  }

  $scope.initLocation = function () {
    GeolocationFactory.getLocation()
      .then($scope.handlePosition, $scope.showError);
  };

  $scope.initLocation();


});
