///////////// ref for world clock
// http://www.proglogic.com/code/javascript/time/worldclock.php

'use strict';
angular.module('main')
.controller('TimesCtrl', function ($scope, $log, $timeout, $q, currentLocation, TimeFactory, RiserFactory, GeolocationFactory) {

  $scope.data = {};
  $scope.data.testes = 'asdfasdf';
  $scope.data.inUseLocation = GeolocationFactory.inUseLocation;
  $scope.data.location = GeolocationFactory.inUseLocation.location;

  // $log.log('data.location', $scope.data.location);

  $scope.tickIndex = 0;

  function updateLocation() {
    GeolocationFactory.getLocation().then(function(loc) {
      $scope.data.location = loc;
      $log.log('Updated location: ', $scope.data.location);

    });
  }

  // Strangely, this is only for calculating the EOT.
  // The other Date instance lives in the TimeFactory.
  function updateDate() {
    var date = new Date();
    if (typeof $scope.data.timezone.data.rawOffset !== 'undefined') {
      date.setTime(date.getTime() + $scope.data.timezone.data.rawOffset / 60000);
    } else {
      date.setTime(date.getTime() + $scope.data.location.coords.longitude * (86400 / 360 / 60000) );
    }

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getYear();

    return {
      day: day,
      month: month,
      year: year
    };
  }

  // (theirs)
  function updateEOT() {
    var date = updateDate();
    var JD = RiserFactory.getJD(date.day, date.month, date.year); // day, month, year
    var T = RiserFactory.calcTimeJulianCent(JD); // The units? No idea.
    // $scope.data.EOT = parseFloat(RiserFactory.calcEquationOfTime(T)); // in minutes
    $scope.data.EOT = TimeFactory.equationOfTime() / 60.0000000000000;
    //\\
    // $log.log('$scope.data.EOT',$scope.data.EOT);
    $scope.data.presentableEOT = RiserFactory.betterTimeString($scope.data.EOT * 60);
  }
  // (ours)
  // $scope.data.eot = TimeFactory.equationOfTime();

  function tickable() {
    if ($scope.tickIndex % 30 === 0 && $scope.data.inUseLocation.isActual) {
      updateLocation();
    } // it's ok if this is out of sync with the scope a little

    $scope.tickIndex++;
    // $log.log('Ticking @ ', $scope.tickIndex);
    //
    // $log.log('$scope.data.timezone.data.rawOffset', $scope.data.timezone.data.rawOffset);
    // $log.log('$scope.data.location.coords.longitude * (86400 / 360)', $scope.data.location.coords.longitude * (86400 / 360));
    // $log.log('$scope.data.EOT', $scope.data.EOT);
    $scope.data.times = TimeFactory.allTheTimes(
      $scope.data.location.coords.latitude,
      $scope.data.location.coords.longitude,
      $scope.data.timezone.data.rawOffset || undefined, // $scope.data.location.coords.longitude * (86400 / 360), // or ratio around the world from Greenwich
      $scope.data.timezone.data.dstOffset || 0, //
      $scope.data.EOT//$scope.data.EOT // use their EOT,
    );

    $scope.data.diffMeanClock = RiserFactory.betterTimeString($scope.data.times.diffs.meanVclock);
    $scope.data.diffTrueClock = RiserFactory.betterTimeString($scope.data.times.diffs.trueVclock);

    // $scope.data.diffsPretty = {};

    // $scope.data.diffsPretty = {
    //   meanVclock: RiserFactory.betterTimeString($scope.data.times.times.diffs.meanVclock),
    //   trueVclock: RiserFactory.betterTimeString($scope.data.times.times.diffs.trueVclock)
    // };
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

  function init() {

    getTimeZone($scope.data.location).then(function(tz) {
      $scope.data.timezone = tz;
      updateEOT(); // set time
    }).finally(tickTock);
  }

  function tickTock() {
    tickable();
    $timeout(tickTock, 1000); // calls itself every second
  }

  $scope.$on('$ionicView.enter', function() {
    $scope.tickIndex = 0;
    $scope.data.inUseLocation = GeolocationFactory.inUseLocation;
    $scope.data.location = GeolocationFactory.inUseLocation.location;
    init();
  });



});
