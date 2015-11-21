'use strict';
angular.module('main')
.constant('MAPSTYLE', {

  STYLE1: [
          {
            "featureType": "road.highway",
            "stylers": [
              { "visibility": "off" }
            ]
          },{
            "featureType": "road.arterial",
            "stylers": [
              { "visibility": "off" }
            ]
          },{
            "featureType": "road.local",
            "stylers": [
              { "visibility": "off" }
            ]
          },{
            "featureType": "administrative.locality",
            "stylers": [
              { "visibility": "simplified" }
            ]
          },{
            "featureType": "water",
            "stylers": [
              { "color": "#87d5dd" }
            ]
          },{
            "featureType": "landscape.man_made",
            "stylers": [
              { "saturation": 29 },
              { "lightness": 17 },
              { "gamma": 0.81 }
            ]
          }
          ]

});
