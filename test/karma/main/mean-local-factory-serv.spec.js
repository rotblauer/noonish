'use strict';

describe('module: main, service: MeanLocalFactory', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var MeanLocalFactory;
  beforeEach(inject(function (_MeanLocalFactory_) {
    MeanLocalFactory = _MeanLocalFactory_;
  }));

  it('should do something', function () {
    expect(!!MeanLocalFactory).toBe(true);
  });

});
