import { Angular2EventfeedbackPage } from './app.po';

describe('angular2-eventfeedback App', function() {
  let page: Angular2EventfeedbackPage;

  beforeEach(() => {
    page = new Angular2EventfeedbackPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('angular2-eventfeedback works!');
  });
});
