'use strict';
angular.module('main')
.service('GeoLocate', function ($log, $q, $cordovaGeolocation) {

  $log.log('Hello from your Service: GeoLocate in module main');

  function get () {
    var defer = $q.defer();
    var options = {
      timeout: 10000,
      enableHighAccuracy: true
    };
    $cordovaGeolocation.getCurrentPosition(options)
      .then(
        function (position) { // Success.
        $log.log('Latitude: '       + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
          defer.resolve(position);         // Resolve position.
        },
        // Error.
        function (error) { defer.reject({ERROR: error}); console.log('ERROR: ' + error); }
      );
    return defer.promise;
  }

  return {
    get: get
  };

});

// var posOptions = {timeout: 10000, enableHighAccuracy: false};
// var onSuccess = function(position) {
//     $log.log('Latitude: '          + position.coords.latitude          + '\n' +
//           'Longitude: '         + position.coords.longitude         + '\n' +
//           'Altitude: '          + position.coords.altitude          + '\n' +
//           'Accuracy: '          + position.coords.accuracy          + '\n' +
//           'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
//           'Heading: '           + position.coords.heading           + '\n' +
//           'Speed: '             + position.coords.speed             + '\n' +
//           'Timestamp: '         + position.timestamp                + '\n');

//     deferred.resolve(position);
// };

// // onError Callback receives a PositionError object
// //
// function onError(error) {
//     $log.log('code: '    + error.code    + '\n' +
//           'message: ' + error.message + '\n');
//     deferred.reject(error);
// }

