'use strict';
angular.module('main')
.controller('NumbasCtrl', function ($scope, $log, TimeFactory, RiserFactory, GeolocationFactory) {

  $scope.cDay = TimeFactory.cardinalDay();
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

  $scope.angleToSun = RiserFactory.howHighInSky($scope.JD);
  $scope.declination = RiserFactory.getDeclination($scope.JD);

});
