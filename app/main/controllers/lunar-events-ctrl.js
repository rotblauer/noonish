///////////// ref for world clock
// http://www.proglogic.com/code/javascript/time/worldclock.php

'use strict';
angular.module('main')
.controller('LunarEventsCtrl', function ($scope, $log, currentLocation, SunCalcFactory) {

  $scope.data = {};
  $scope.data.string = 'hello';
  $scope.data.currentLocation = currentLocation;

  var date = Date.now();
  var lat = currentLocation.coords.latitude;
  var lng = currentLocation.coords.longitude;


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





});
