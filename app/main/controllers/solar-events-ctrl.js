///////////// ref for world clock
// http://www.proglogic.com/code/javascript/time/worldclock.php

'use strict';
angular.module('main')
.controller('SolarEventsCtrl', function ($scope, $log, GeolocationFactory, SunCalcFactory) {

  $scope.data = {};
  $scope.data.string = 'hello';
  $scope.data.location = GeolocationFactory.inUseLocation;
  $scope.data.currentLocation = GeolocationFactory.inUseLocation.location;
  // $log.log('timer2 ctrl', $scope.data.currentLocation);

  function init() {

    var date = Date.now();
    var lat = $scope.data.currentLocation.coords.latitude;
    var lng = $scope.data.currentLocation.coords.longitude;

    var times = SunCalcFactory.getTimes(date, lat, lng);
    var orderedTimes = {
      nauticalDawn: times['nauticalDawn'],
      dawn: times['dawn'],
      sunrise: times['sunrise'],
      sunriseEnd: times['sunriseEnd'],
      // goldenHourEnd: times['goldenHourEnd'],
      solarNoon: times['solarNoon'],
      // goldenHour: times['goldenHour'],
      sunsetStart: times['sunsetStart'],
      sunset: times['sunset'],
      dusk: times['dusk'],
      nauticalDusk: times['nauticalDusk'],
      night: times['night'],
      nadir: times['nadir'],
      nightEnd: times['nightEnd']
    };

    $scope.events = []; // for timeline
    angular.forEach(orderedTimes, function (val, key) {
      var obj = {
        badgeClass: 'warning',
        badgeIconClass: 'glyphicon-check',
        title: key,
        content: val
      };
      this.push(obj);
    }, $scope.events);
  }




  $scope.$on('$ionicView.enter', function() {
    $scope.data.location = GeolocationFactory.inUseLocation;
    $scope.data.currentLocation = GeolocationFactory.inUseLocation.location;
    init();
  });



});
