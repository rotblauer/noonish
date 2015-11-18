'use strict';

describe('module: main, service: GeoLocate', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var GeoLocate;
  beforeEach(inject(function (_GeoLocate_) {
    GeoLocate = _GeoLocate_;
  }));

  it('should do something', function () {
    expect(!!GeoLocate).toBe(true);
  });

});
