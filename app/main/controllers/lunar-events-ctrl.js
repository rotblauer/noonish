///////////// ref for world clock
// http://www.proglogic.com/code/javascript/time/worldclock.php

'use strict';
angular.module('main')
.controller('LunarEventsCtrl', function ($scope, $log, $q, GeolocationFactory, TimeFactory, SunCalcFactory) {

  $scope.data = {};
  $scope.data.string = 'hello';
  $scope.data.inUseLocation = GeolocationFactory.inUseLocation;
  $scope.data.currentLocation = GeolocationFactory.inUseLocation.location;


  function init() {
    var date = new Date();
    var lat = $scope.data.currentLocation.coords.latitude;
    var lng = $scope.data.currentLocation.coords.longitude;


    var times = SunCalcFactory.getMoonTimes(date, lat, lng);
    $scope.data.moonIllumination = SunCalcFactory.getMoonIllumination(date);

    // Returns an object with the following properties:

    // fraction: illuminated fraction of the moon; varies from 0.0 (new moon) to 1.0 (full moon)
    // phase: moon phase; varies from 0.0 to 1.0, described below
    // angle: midpoint angle in radians of the illuminated limb of the moon reckoned eastward from the north point of the disk; the moon is waxing if the angle is negative, and waning if positive
    // Moon phase value should be interpreted like this:

    // Phase Name
    // 0 New Moon
    // Waxing Crescent
    // 0.25  First Quarter
    // Waxing Gibbous
    // 0.5 Full Moon
    // Waning Gibbous
    // 0.75  Last Quarter
    // Waning Crescent
    //
    //
    //
    var orderedTimes = {
      Rise: times['rise'],
      Set: times['set']
    };

    $scope.events = []; // for timeline
    angular.forEach(orderedTimes, function (val, key) {
      var obj = {
        badgeClass: 'default',
        badgeIconClass: 'glyphicon-check',
        title: key,
        content: val
      };
      this.push(obj);
    }, $scope.events);
  }

  function getTimeZone(loc) {
    var defer = $q.defer();
    if (typeof $scope.data.inUseLocation['timezone'] === 'undefined') {
      TimeFactory.getLocalTimeZoneGoogle(loc.coords.latitude, loc.coords.longitude).then(function(tz) {
        GeolocationFactory.inUseLocation['timezone'] = tz;
        defer.resolve(tz);
      });
    } else {
      defer.resolve($scope.data.inUseLocation['timezone']);
    }
    return defer.promise;
  }



  $scope.$on('$ionicView.enter', function() {
    $scope.data.inUseLocation = GeolocationFactory.inUseLocation;
    $scope.data.currentLocation = GeolocationFactory.inUseLocation.location;

    getTimeZone($scope.data.currentLocation).then(function(tz) {
      $scope.data.timezone = tz;
      init();
    });
  });



});
