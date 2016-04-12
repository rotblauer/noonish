///////////// ref for world clock
// http://www.proglogic.com/code/javascript/time/worldclock.php

'use strict';
angular.module('main')
.controller('TimesCtrl', function ($scope, $log, $timeout, currentLocation, TimeFactory, RiserFactory, GeolocationFactory) {

  $scope.data = {};
  $scope.data.location = currentLocation;
  $log.log('data.location', $scope.data.location);

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
    $scope.data.EOT = -RiserFactory.calcEquationOfTime(T); // in minutes
    //\\
    // $log.log('$scope.data.EOT',$scope.data.EOT);
    $scope.data.presentableEOT = RiserFactory.betterTimeString($scope.data.EOT * 60);
  }
  // (ours)
  // $scope.data.eot = TimeFactory.equationOfTime();

  function tickable() {
    if ($scope.tickIndex % 30 === 0) { updateLocation(); } // it's ok if this is out of sync with the scope a little

    $scope.tickIndex++;
    $log.log('Ticking @ ', $scope.tickIndex);

    $scope.data.times = TimeFactory.allTheTimes(
      $scope.data.location.coords.latitude,
      $scope.data.location.coords.longitude,
      $scope.data.timezone.data.rawOffset,
      $scope.data.timezone.data.dstOffset,
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
    return TimeFactory.getLocalTimeZoneGoogle(loc.coords.latitude, loc.coords.longitude);
  }

  function init() {
    updateEOT(); // set time
    getTimeZone(currentLocation).then(function(tz) {
      $scope.data.timezone = tz;
    }).finally(tickTock);
  }

  function tickTock() {
    tickable();
    $timeout(tickTock, 1000); // calls itself every second
  }
  init();


});
