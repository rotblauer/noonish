'use strict';

describe('module: main, service: TimeFactory', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var TimeFactory;
  beforeEach(inject(function (_TimeFactory_) {
    TimeFactory = _TimeFactory_;
  }));

  it('should do something', function () {
    expect(!!TimeFactory).toBe(true);
  });

});
