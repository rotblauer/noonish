'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'uiGmapgoogle-maps'
  // TODO: load other modules selected during generation
])
.config(function ($stateProvider, $urlRouterProvider) {

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/main/timer');
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'main/templates/menu.html',
      controller: 'MenuCtrl as menu'
    })
    .state('main.timer', {
      url: '/timer',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/timer.html',
          controller: 'TimerCtrl'
        }
      }
    });
    // .state('realTime', {
    //   url: '/real-time',
    //   templateUrl: '/main/templates/timer.html',
    //   controller: 'TimerCtrl'
    // });
});
