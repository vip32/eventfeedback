export class Angular2EventfeedbackPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('angular2-eventfeedback-app h1')).getText();
  }
}
