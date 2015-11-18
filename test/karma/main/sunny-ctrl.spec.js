'use strict';

describe('module: main, controller: SunnyCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var SunnyCtrl;
  beforeEach(inject(function ($controller) {
    SunnyCtrl = $controller('SunnyCtrl');
  }));

  it('should do something', function () {
    expect(!!SunnyCtrl).toBe(true);
  });

});
