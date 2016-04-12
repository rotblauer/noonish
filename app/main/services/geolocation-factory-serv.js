'use strict';
angular.module('main')
.factory('GeolocationFactory', function ($log, $q, $http, $cordovaGeolocation) {

  // $log.log('Hello from your Service: GeolocationFactory in module main');

  var inUseLocation = {};

  function getLocation () {
    var defer = $q.defer();
    if ($cordovaGeolocation) { // If the plugin is there and working

      var posOptions = {
        timeout: 10000,
        enableHighAccuracy: true
      };

      $cordovaGeolocation.getCurrentPosition(posOptions)
        .then(
          function (position) {
            defer.resolve(position);
          },
          function (error) {
            defer.reject({ ERROR:error });
          }
        );

    } else { // otherwise no dice
      defer.reject({ ERROR: 'Geolocation is not supported by this browser.' });
    }

    return defer.promise;
  }

  function getNearByCity (latitude, longitude){
    var defer = $q.defer();
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude +',' + longitude +'&sensor=true';
    $http({method: 'GET', url: url}).
      success(function(data, status, headers, config) {
           defer.resolve({data : data});
      }).
      error(function(data, status, headers, config) {
        defer.reject({error: 'City not found'});
      });
    return defer.promise;
  }

  return {
    getLocation: getLocation,
    getNearByCity: getNearByCity,
    inUseLocation: inUseLocation
  };

});
