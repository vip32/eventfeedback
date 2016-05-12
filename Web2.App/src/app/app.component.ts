import {Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdInput} from '@angular2-material/input';
import {MdCheckbox} from '@angular2-material/checkbox';
import {MdRadioButton, MdRadioGroup, MdRadioDispatcher} from '@angular2-material/radio';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';

@Component({
  ///moduleId: module.id,
  selector: 'eventfeedback-app',
  templateUrl: './app/app.component.html',
  styleUrls: ['./app/app.component.css'],
  directives: [
    MD_SIDENAV_DIRECTIVES,
    MD_LIST_DIRECTIVES,
    MD_CARD_DIRECTIVES,
    MdToolbar,
    MdButton,
    MdInput,
    MdCheckbox,
    MdRadioGroup,
    MdRadioButton,
    MdIcon
  ],
  providers: [HTTP_PROVIDERS, MdIconRegistry, MdRadioDispatcher]
})
export class AppComponent {
  title = 'EventFeedback';
  views: Object[] = [
    {name: 'Profile', description: 'Profile', icon: 'account_circle'},
    {name: 'Event 1', description: 'Event 1', icon: 'event'},
    {name: 'Event 2', description: 'Event 2', icon: 'event'},
    {name: 'Event 3', description: 'Event 3', icon: 'event'}
  ];
  /// private isVisible = false;
  private activeRateForm = 0;

  showRateForm(id) {
    /// this.isVisible = !this.isVisible;
    if (this.activeRateForm == id) {
      this.activeRateForm = 0;
    } else {
      this.activeRateForm = id;
    }
    console.log(id);
  }
  sessions: Object[] = [
    {id: 1, name: 'Session 1'},
    {id: 2, name: 'Session 2'},
    {id: 3, name: 'Session 3'},
    {id: 4, name: 'Session 4'},
    {id: 5, name: 'Session 5'},
    {id: 6, name: 'Session 6'}
  ];
}
