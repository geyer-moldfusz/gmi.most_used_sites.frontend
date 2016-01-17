describe ('trckyrslf App', function() {

 beforeEach(function() {
    browser.get('app/index.html');
  });

  it ('should find visits', function() {
    var visits = element.all(by.repeater('visit in visits'));
    expect(visits.count()).toBe(52);
  });
});
