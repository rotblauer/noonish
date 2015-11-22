///////////// ref for world clock
// http://www.proglogic.com/code/javascript/time/worldclock.php

'use strict';
angular.module('main')
.controller('TimerCtrl', function ($scope, $log, $timeout, $cordovaGeolocation, MAPSTYLE, TimeFactory, RiserFactory, GeolocationFactory) {

    // Initialize variables.
    $scope.position = {}; // will init to current, then can be changed to query
    $scope.map;
    $scope.error = '';
    var n = 0; // init counter for getCity

    $scope.dstOffset; // daylight savings time according to google, ie probably 0 or 3600
    $scope.rawOffset; // timezone according to google, ie -18000
    $scope.timeZoneName; // according to google, ie Eastern Standard Time
    // ie http api response =>
      // data
        // data: Object
        //   dstOffset: 0
        //   rawOffset: -18000
        //   status: "OK"
        //   timeZoneId: "America/New_York"
        //   timeZoneName: "Eastern Standard Time"


    $scope.addressMode = true;

    $scope.changeAddressMode = function () {
      if ( $scope.addressMode ) {
        $scope.addressMode = false;
      } else {
        $scope.addressMode = true;
      }
    }

    function getTimeZone (position) {
      // $log.log('getTimeZone for ', position); // OK
      TimeFactory.getLocalTimeZoneGoogle(position.coords.latitude, position.coords.longitude)
        .then(function timeZoneSuccess (data) {
          $log.log('Got timezone data:', data);

          $scope.dstOffset = data.data.dstOffset;
          $scope.rawOffset = data.data.rawOffset;
          $scope.timeZoneName = data.data.timeZoneName;

          tickTock(); // <-- TICK TOCKs initially called from here.
        }, function timeZoneError (error) {
          $log.log('Error getting time zone', error);
        });
    }
    function timesAndDiffs () {
      var position = $scope.position;
      if (position !== null) {
        var bundled = TimeFactory.allTheTimes(position.coords.latitude, position.coords.longitude, $scope.rawOffset, $scope.dstOffset);

        // times
        $scope.clock = bundled.times.localTime;
        $scope.meanTime = bundled.times.meanTime;
        $scope.trueTime = bundled.times.trueTime;
        // diffs
        // $scope.diffMeanClock = RiserFactory.timeString(TimeFactory.allTheTimes(position.coords.latitude, position.coords.longitude, $scope.rawOffset, $scope.dstOffset).diffs.meanVclock);
        // $scope.diffTrueClock = RiserFactory.timeString(TimeFactory.allTheTimes(position.coords.latitude, position.coords.longitude, $scope.rawOffset, $scope.dstOffset).diffs.trueVclock);
        $scope.diffMeanClock = RiserFactory.betterTimeString(bundled.diffs.meanVclock);
        $scope.diffTrueClock = RiserFactory.betterTimeString(bundled.diffs.trueVclock);
      }
    }
    function tickTock () {
      // $scope.clock = TimeFactory.allTheTimes(); // re new clock time.
      timesAndDiffs();
      $timeout(tickTock, 1000); // calls itself every second
    }

    $scope.$watch('position', function (val) {
      $log.log('$scope.position changed to ', val);
    });

    ////////////////////////////////////////////////////////////
    // Locations and mappery.
    ////////////////////////////////////////////////////////////
    function getCity (position) {
      GeolocationFactory.getNearByCity(position.coords.latitude, position.coords.longitude)
        .then(function (data) {
          $log.log('nearByCity data', data);
          if ( data.data.status !== 'ZERO_RESULTS' )
          {
            $scope.nearestCity = data.data.results[0]['formatted_address'];
          }
          else
          {
            $scope.nearestCity = 'The wine dark sea.';
          }
        })
        .catch( function couldntGetCity (error) {
          $log.log('Just keep swimming.');
        });
    }
    function initializeMap (position) { // init map to current location
      var styleArray = MAPSTYLE.STYLE1; // constants/mapstyle-constant.js
      $scope.map = { // Create the Google Map
        center: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        zoom: 5,
        styles: styleArray,
        options: {
          // disableDefaultUI: true
        }
      };
      $scope.marker = {
        map: $scope.map,
        idKey: '1',
        coords: $scope.map.center
      };
    };
    function geoLocateHandler (position) {
      // Set location variables.
      $scope.position = position;
      $scope.error = ''; // clear error in case there was one
      $log.log('current location:', position);
      initializeMap(position);
      if ( n === 0 ) { // only do this the first time
        getCity(position);
        getTimeZone(position);
        // tickTock();
      }
      n += 1;
    }
    // current position
    $scope.geoLocate = function () {
      GeolocationFactory.getLocation()
        .then(
          geoLocateHandler, // success callback
          showError //
        );
    }
    // set location by map
    $scope.chooseLocation = function (latLng) { // arg handed from view (map.center)
      $log.log('chosen latLngL: ', latLng)
      // format map.center like the geolocator
      $scope.position = { coords: { latitude: latLng.latitude, longitude: latLng.longitude }};
      getCity($scope.position);
      getTimeZone($scope.position);
    };
    // init
    $scope.geoLocate();


    ///////////////////////////////////////////////////////////////////////////
    // Dumb helpers.
    ///////////////////////////////////////////////////////////////////////////
    function showError (error) {
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

    // Initialize result function in case of error.
    // $scope.showResult = function() {
    //   return $scope.error === '';
    // };
});
