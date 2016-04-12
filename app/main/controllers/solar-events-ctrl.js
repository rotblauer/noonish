  ///////////// ref for world clock
// http://www.proglogic.com/code/javascript/time/worldclock.php

'use strict';
angular.module('main')
.controller('SolarEventsCtrl', function ($scope, $log, $q, GeolocationFactory, TimeFactory, SunCalcFactory) {

  $scope.data = {};
  $scope.data.string = 'hello';
  $scope.data.inUseLocation = GeolocationFactory.inUseLocation;
  $scope.data.currentLocation = GeolocationFactory.inUseLocation.location;
  // $log.log('timer2 ctrl', $scope.data.currentLocation);

  function init() {

    var date = new Date();

    // var m = date.setTime(date.getTime() + ($scope.data.timezone.data.rawOffset - $scope.data.timezone.data.dstOffset)*1000);
    $log.log('date', date);
    var lat = $scope.data.currentLocation.coords.latitude;
    var lng = $scope.data.currentLocation.coords.longitude;


    // Starting to thing that Suncalc doesn't work for anything east of Greenwich.
    // // BECAUSE it's showing time in my local time. Gotcha.
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
