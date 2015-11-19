'use strict';

describe('module: main, controller: NumbasCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var NumbasCtrl;
  beforeEach(inject(function ($controller) {
    NumbasCtrl = $controller('NumbasCtrl');
  }));

  it('should do something', function () {
    expect(!!NumbasCtrl).toBe(true);
  });

});
