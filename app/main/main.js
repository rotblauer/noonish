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
        currentLocation: function($log, GeolocationFactory) {
          return GeolocationFactory.getLocation().then(function(loc) {
            $log.log(loc);
            return loc;
          }, function(err) {
            $log.log(err);
            return err;
          });
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
    .state('main.location', {
      url: '/location',
      views: {
        'tabs-location': {
          templateUrl: 'main/templates/location.html',
          controller: 'LocationCtrl'
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
