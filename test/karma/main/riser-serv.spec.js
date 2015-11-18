'use strict';

describe('module: main, service: Riser', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Riser;
  beforeEach(inject(function (_Riser_) {
    Riser = _Riser_;
  }));

  it('should do something', function () {
    expect(!!Riser).toBe(true);
  });

});
