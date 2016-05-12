import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { Angular2EventfeedbackAppComponent } from '../app/angular2-eventfeedback.component';

beforeEachProviders(() => [Angular2EventfeedbackAppComponent]);

describe('App: Angular2Eventfeedback', () => {
  it('should create the app',
      inject([Angular2EventfeedbackAppComponent], (app: Angular2EventfeedbackAppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'angular2-eventfeedback works!\'',
      inject([Angular2EventfeedbackAppComponent], (app: Angular2EventfeedbackAppComponent) => {
    expect(app.title).toEqual('angular2-eventfeedback works!');
  }));
});
