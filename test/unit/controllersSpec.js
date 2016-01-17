describe('VisitsController', function() {

  beforeEach(module('trckyrslfApp'));
  beforeEach(module('trckyrslfServices'));



  it('should create visits model', inject(function(_$httpBackend_, $rootScope, $controller) {
    var $httpBackend = _$httpBackend_;

    var scope = $rootScope.$new(),
            ctrl = $controller('VisitsController', {$scope:scope});
    console.log(scope.visits);
    expect(scope['visits'].length).toBe(52);
    $httpBackend.flush();
  }));
});

