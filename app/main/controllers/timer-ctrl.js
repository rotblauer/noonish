///////////// ref for world clock
// http://www.proglogic.com/code/javascript/time/worldclock.php

'use strict';
angular.module('main')
.controller('TimerCtrl', function ($scope, $log, $timeout, $cordovaGeolocation, MAPSTYLE, TimeFactory, RiserFactory, GeolocationFactory) {

    $log.log('I exist');
    $scope.stuff = "teasdfa";
    // Initialize variables.
    $scope.position = {}; // will init to current, then can be changed to query
    $scope.map;
    $scope.error = '';
    $scope.addressMode = true;
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

    $scope.changeAddressMode = function () {
      if ( $scope.addressMode ) {
        $scope.addressMode = false;
      } else {
        $scope.addressMode = true;
      }
    }

    ////////////////////////////////////////////////////////////
    // Sunburners.
    ////////////////////////////////////////////////////////////
    var d = new Date();

    $scope.day   = d.getDate();
    $scope.month = d.getMonth();
    $scope.year  = d.getFullYear();

    $scope.hr    = d.getHours();
    $scope.mn    = d.getMinutes();
    $scope.sex   = d.getSeconds();
    $log.log('hr/mn/sex', $scope.hr, $scope.mn, $scope.sex);

    // JD -> Julian Day *Number*
    $scope.JD = RiserFactory.getJD($scope.day, $scope.month, $scope.year); // (day, month, year)

    // jd + local time (== minutes today) - timezone/24 hrs

    ////////////////////////////////////////////////////////////
    // TESTERS.
    ////////////////////////////////////////////////////////////

    function compareEOTs () {

      // Fraction of day
      $scope.localTimeMinRatio          = RiserFactory.getTimeLocal($scope.hr, $scope.mn, $scope.sex, $scope.dstOffset);
      $log.info($scope.localTimeMinRatio);

      // Julian Date fraction -> fraction of day since preceding noon GMT
      $scope.localTotalJD               = $scope.JD + ($scope.localTimeMinRatio / 1440) - ($scope.rawOffset / 24);
      $log.info($scope.localTotalJD);

      // Julian date. JDN + ^
      $scope.calcTimeJulianCent         = RiserFactory.calcTimeJulianCent($scope.localTotalJD); // arg total jd, return T // ~$scope.JD
      // // $scope.calcJDFromJulianCent = RiserFactory.calcJDFromJulianCent($scope.calcTimeJulianCent); // arg t, return
      $log.info('$scope.calcTimeJulianCent', $scope.calcTimeJulianCent);

      // Time Factory EOT

      $scope.TFEOT                      = TimeFactory.equationOfTime() / 60.0000;
      $log.log('$scope.TFEOT', $scope.TFEOT);

      //
      $scope.calcEquationOfTimeJD       = RiserFactory.calcEquationOfTime($scope.JD); //calcTimeJulianCent
      $scope.calcEquationOfTimeJC       = RiserFactory.calcEquationOfTime($scope.calcTimeJulianCent); //calcTimeJulianCent
    }

    ////////////////////////////////////////////////////////////
    // Timers.
    ////////////////////////////////////////////////////////////
    function getTimeZone (position) {
      // $log.log('getTimeZone for ', position); // OK
      TimeFactory.getLocalTimeZoneGoogle(position.coords.latitude, position.coords.longitude)
        .then(function timeZoneSuccess (data) {
          $log.log('Got timezone data:', data);

          $scope.dstOffset = data.data.dstOffset;
          $scope.rawOffset = data.data.rawOffset;
          $scope.timeZoneName = data.data.timeZoneName;
          compareEOTs();
          $scope.mapMoved = false;
          solarEventTimes(); // only called once
          tickTock(); // <-- TICK TOCKs initially called from here.
        }, function timeZoneError (error) {
          $log.log('Error getting time zone', error);
        });
    }
    function solarEventTimes () {
      var position = $scope.position;  // set function position to scope.
      if (position !== null) {
        $scope.sunrise = RiserFactory.calcSunriseSet(1, $scope.JD, position.coords.latitude, position.coords.longitude, $scope.rawOffset, $scope.dstOffset); // rise[1:morn, 0:eve], JD, latitude, longitude, timezone, dst
        $scope.sunset = RiserFactory.calcSunriseSet(0, $scope.JD, position.coords.latitude, position.coords.longitude, $scope.rawOffset, $scope.dstOffset); // rise[1:morn, 0:eve], JD, latitude, longitude, timezone, dst
        $scope.noon = RiserFactory.solarNoon($scope.JD, position.coords.longitude, $scope.rawOffset, $scope.dstOffset);
      }
    }
    function timesAndDiffs () {
      var position = $scope.position;  // set function position to scope.
      if (position !== null) {
        var bundled = TimeFactory.allTheTimes(position.coords.latitude, position.coords.longitude, $scope.rawOffset, $scope.dstOffset);
        // times
        $scope.clock = bundled.times.localTime;
        $scope.meanTime = bundled.times.meanTime;
        $scope.trueTime = bundled.times.trueTime;
        // diffs
        $scope.diffMeanClock = RiserFactory.betterTimeString(bundled.diffs.meanVclock);
        $scope.diffTrueClock = RiserFactory.betterTimeString(bundled.diffs.trueVclock);
      }
    }
    function tickTock () {
      // $scope.clock = TimeFactory.allTheTimes(); // re new clock time.
      timesAndDiffs();
      $timeout(tickTock, 1000); // calls itself every second
    }

    ////////////////////////////////////////////////////////////
    // Locations and mappery.
    ////////////////////////////////////////////////////////////
    function getCity (position) {
      GeolocationFactory.getNearByCity(position.coords.latitude, position.coords.longitude)
        .then(function (data) {
          $log.log('nearByCity data', data);
          if ( data.data.status !== 'ZERO_RESULTS' ) {
            $scope.nearestCity = data.data.results[0]['formatted_address'];
          }
          else {
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
        },
        events: {
          drag: function () {
            $scope.mapMoved = true;
          }
        }
      };
      var mapIcon = 'main/assets/images/map-icon-target.png';
      $scope.marker = {
        map: $scope.map,
        idKey: '1',
        coords: $scope.map.center,
        options: {
          icon: mapIcon
        }
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
      n = 0;
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
