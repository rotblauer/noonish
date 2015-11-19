'use strict';
angular.module('main')
  .filter('secondsToDateTime', [function() {
      return function(seconds) {
          return new Date(1970, 0, 1).setSeconds(seconds);
      };
  }])
  // https://gist.github.com/ferronrsmith/5630696
  .filter('ordinal', function($filter) {
    return function(input) {
      var s=["th","st","nd","rd"],
      v=input%100;
      return input+(s[(v-20)%10]||s[v]||s[0]);
    }
  });;
