'use strict';
angular.module('main')
.controller('LocationCtrl', function ($scope, $log, currentLocation, MAPSTYLE, TimeFactory, RiserFactory, GeolocationFactory) {

  $scope.data = {};

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
        // click: function(handler) {
        //   $log.log(handler.center.lat());
        //   // $log.log('mouseEvent', mouseEvent.latLng);
        //   // $log.log('lat', mouseEvent.latLng.lat());
        //   // $log.log('lng', mouseEvent.latLng.lng());
        //   // setMarker(mouseEvent.latLng);
        // }
        click: mapClicked
      }
    };
    var mapIcon = 'main/assets/images/map-icon-target.png';
    setMarker(position);
  }

  function setMarker(pos) {
    $log.log('setting marker @ ', pos);
    $scope.data.marker = {
      map: $scope.map,
      idKey: '1',
      coords: {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      },
      options: {
        // icon: mapIcon
      }
    };
    getCity(pos);
    getTimeZone(pos.coords.latitude, pos.coords.longitude);
  }

  function mapClicked(mapModel, eventName, originalEventArgs) {
    var e = originalEventArgs[0];
    var lat = e.latLng.lat()
      , lng = e.latLng.lng()
      , pos = {
        coords: {
          latitude: lat,
          longitude: lng
        }
      }
      ;
    $log.log('pos', pos);
    setMarker(pos);
    $scope.locationActual = false;
  }


  function getCity (position) {
    GeolocationFactory.getNearByCity(position.coords.latitude, position.coords.longitude)
      .then(function gotCity(data) {
        $log.log('nearByCity data', data);
        if ( data.data.status !== 'ZERO_RESULTS' ) {
          $scope.data.nearestCity = data.data.results[0]['formatted_address'];
        }
        else {
          $scope.data.nearestCity = 'The wine dark sea.';
        }
      })
      .catch( function couldntGetCity (error) {
        $log.log('Just keep swimming.');
      });
  }
  function getTimeZone(lat, lng) {
    TimeFactory.getLocalTimeZoneGoogle(lat, lng)
      .then(function gotTimezone(tz) {
        $scope.data.timezone = tz;
      })
      .catch(function timeZoneError(err) {
        $scope.data.timezone = {
          data: {
            timeZoneName: 'Timezone unavailable.'
          }
        };
      });
  }

  function handleLocation (position, shouldInitMap) {
    $log.log('current location:', position);

    // clear error in case there was one
    $scope.error = '';

    if (shouldInitMap) {
      initializeMap(position);
      $scope.locationActual = true;
    } else {
      $scope.locationActual = false;
    }


    getCity(position);
    getTimeZone(position.coords.latitude, position.coords.longitude);
  }

  $scope.findMe = function() {
    GeolocationFactory.getLocation().then(function(loc) {
      handleLocation(loc, true);
    }, showError);
  };

  function showError (error) {
    switch (error.code) {
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
  }

  // init
  handleLocation(currentLocation, true);



});
