'use strict';

describe('module: main, service: GeolocationFactory', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var GeolocationFactory;
  beforeEach(inject(function (_GeolocationFactory_) {
    GeolocationFactory = _GeolocationFactory_;
  }));

  it('should do something', function () {
    expect(!!GeolocationFactory).toBe(true);
  });

});
