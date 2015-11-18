'use strict';

describe('module: main, service: TrueSolarFactory', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var TrueSolarFactory;
  beforeEach(inject(function (_TrueSolarFactory_) {
    TrueSolarFactory = _TrueSolarFactory_;
  }));

  it('should do something', function () {
    expect(!!TrueSolarFactory).toBe(true);
  });

});
