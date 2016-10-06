describe('Profile', () => {

  beforeEach( () => {
    browser.get('/profile');
  });

  it('should have correct feature heading', () => {
    expect(element(by.css('app-profile h2')).getText()).toEqual('Features');
  });

});
