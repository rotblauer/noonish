'use strict';
angular.module('main')
.controller('TimerCtrl', function ($scope, $log, $timeout, $cordovaGeolocation, MAPSTYLE, TimeFactory, RiserFactory, GeolocationFactory) {

    // Initialize variables.
    $scope.position = {}; // will init to current, then can be changed to query
    $scope.map;
    $scope.error = '';
    var n = 0; // init counter for getCity
    $scope.x = {};
    $scope.x.dst;

    $scope.addressMode = true;

    $scope.changeAddressMode = function () {
      if ( $scope.addressMode ) {
        $scope.addressMode = false;
      } else {
        $scope.addressMode = true;
      }
    }

    // init() -> get initial location, set map, start timers
    // go() -> get map center(), get times for new loc

///////////// ref for world clock
// http://www.proglogic.com/code/javascript/time/worldclock.php

    function initializeMap (position) { // init map to current location
      var styleArray = MAPSTYLE.STYLE1; // constants/mapstyle-constant.js
      $scope.map = { // Create the Google Map
        center: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        zoom: 10,
        styles: styleArray,
        options: {
          // disableDefaultUI: true
        },
        events: {
          // dblclick: function (latLng) {
          //   // var spot = ;
          //   alert('you clicked!');
          //   $log.log('latLng: ', latLng);
          //   clickLocate(latLng);
          // }
        }
      };
      $scope.marker = {
        map: $scope.map,
        idKey: '1',
        coords: $scope.map.center
      };
      // $scope.marker.bindTo('coords', $scope.map, 'center');
    };

    function meanTimer (position) {
      if (position !== null) {
        // $log.log(position);
        var pos = position;
        var lon = pos.coords.longitude;
        $scope.meanTime = TimeFactory.getMeanSolar(lon, $scope.x.dst);
      }
    };

    function trueTimer (position) {
      if (position !== null) {
        // $log.log(position);
        var pos = position;
        var lon = pos.coords.longitude;
        $scope.trueTime = TimeFactory.getTrueSolar(lon, $scope.x.dst);
      }
    };

    function keepTime () {
      if ( $scope.position !== null ) { // if position promise is returned
        var pos = $scope.position;
        meanTimer(pos); // get mean local
        trueTimer(pos); // get true local
        $scope.diffMeanClock = RiserFactory.timeString(TimeFactory.diffMeanClock(pos.coords.longitude));
        $scope.diffTrueClock = RiserFactory.timeString(TimeFactory.diffTrueClock(pos.coords.longitude));
      }
    }

    function geoLocateHandler (position) {
      // Set location variables.
      $scope.position = position;
      initializeMap(position);
      if ( n === 0 ) { // only do this the first time
        getCity(position);
        tickTock(); // so we wait for position to be returned
      }
      n += 1;

    };

    function getCity (position) {
      GeolocationFactory.getNearByCity(position.coords.latitude, position.coords.longitude)
        .then(function (data) {
          $log.log('nearByCity data', data);
          $scope.nearestCity = data.data.results[0]['formatted_address'];
        });
    }

    // get user's current location
    function geoLocate () {
      GeolocationFactory.getLocation()
        .then(
          geoLocateHandler, // success callback
          showError //
        );
    };

    // set location by map
    $scope.setLocate = function () {
      $log.log($scope.map.center); // { latitude: 40, longitude: 70 }
      var newPos = { // format map.center like the geolocator
        coords: {
          latitude: $scope.map.center.latitude,
          longitude: $scope.map.center.longitude
        }
      };
      $scope.position = newPos;
      getCity(newPos);
      keepTime();
      // $scope.position = $scope.map.center;
    }

    function clickLocate (spot) {
      $log.log(spot); // { latitude: 40, longitude: 70 }
      var newPos = { // format map.center like the geolocator
        coords: {
          latitude: spot.latitude,
          longitude: spot.longitude
        }
      };
      $scope.position = newPos;
      getCity(newPos);
      keepTime();
      // $scope.position = $scope.map.center;
    }

    function tickTock () {
      $scope.clock = new Date(); // Set the clock time.
      keepTime();
      $timeout(tickTock, 1000); // Tick.
    };

    geoLocate(); // init


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
    $scope.showResult = function() {
      return $scope.error === '';
    };
});
