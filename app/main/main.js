'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'uiGmapgoogle-maps',
  'LocalForageModule',
  'angular-timeline'
])
.config(function ($stateProvider, $urlRouterProvider) {

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/main/solarEvents');
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'main/templates/tabs.html',
      controller: 'MainCtrl as mainCtrl',
      resolve: {
        currentLocation: function(GeolocationFactory) {
          return GeolocationFactory.getLocation().then(function(loc) {
            var loc = loc;
            return GeolocationFactory.getNearByCity(loc.coords.latitude, loc.coords.longitude).then(function(data) {
              var data = data;
              var address = data.data.results[0]['formatted_address'];
              // return loc;
              return GeolocationFactory.inUseLocation = {
                location: loc,
                isActual: true,
                address: address
              };
            });

          });
        }
        // local: function($log, GeolocationFactory, TimeFactory) {
        //   return GeolocationFactory.getLocation().then(function(loc) {
        //     // $log.log('loc', loc);
        //     var loc = loc;
        //     return TimeFactory.getLocalTimeZoneGoogle(loc.coords.latitude, loc.coords.longitude).then(function(tz) {
        //       $log.log('loc', loc);
        //       $log.log('tz', tz);
        //       return {
        //         location: loc,
        //         timezone: tz
        //       };
        //     });
        //   })
        //   .catch(function(err) {
        //     $log.log(err);
        //     return {error: err};
        //   });
        // }
      }
    })
    .state('main.location', {
      url: '/location',
      views: {
        'tabs-location': {
          templateUrl: 'main/templates/location.html',
          controller: 'LocationCtrl'
        }
      }
    })
    .state('main.times', {
      url: '/times',
      views: {
        'tabs-times': {
          templateUrl: 'main/templates/times.html',
          controller: 'TimesCtrl'
        }
      }
    })
    .state('main.solarEvents', {
      url: '/solarEvents',
      views: {
        'tabs-solarevents': {
          templateUrl: 'main/templates/solarEvents.html',
          controller: 'SolarEventsCtrl'
        }
      }
    })
    .state('main.lunarEvents', {
      url: '/lunarEvents',
      views: {
        'tabs-lunarevents': {
          templateUrl: 'main/templates/lunarEvents.html',
          controller: 'LunarEventsCtrl'
        }
      }
    })

    .state('main.numbas', {
      url: '/numbas',
      views: {
        'tabs-numbas': {
          templateUrl: 'main/templates/numbas2.html',
          // templateUrl: 'main/templates/numbas.html',
          controller: 'Numbas2Ctrl'
        }
      }
    })
    ;
});
