import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';

import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list/list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card/card';
import {MdToolbar} from '@angular2-material/toolbar/toolbar';
import {MdButton} from '@angular2-material/button/button';
import {MdInput} from '@angular2-material/input/input';
import {MdCheckbox} from '@angular2-material/checkbox/checkbox';
import {MdRadioButton, MdRadioGroup, MdRadioDispatcher} from '@angular2-material/radio/radio';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon/icon';

import {Event} from '../../shared/backend.service';

@Component({
  moduleId: module.id,
  selector: 'app-event',
  templateUrl: 'event.component.html',
  styleUrls: ['event.component.css'],
  directives: [
    MD_SIDENAV_DIRECTIVES, MD_LIST_DIRECTIVES,
    MD_CARD_DIRECTIVES, MdToolbar, MdButton, MdInput,
    MdCheckbox, MdRadioGroup, MdRadioButton, MdIcon,
  ],
  providers: [HTTP_PROVIDERS, MdIconRegistry, MdRadioDispatcher]
})
export class EventComponent  {
  @Input() event: Event;
  @Output() onSelected = new EventEmitter<Event>();

  isSelected = false;

  select(event: Event) {
    console.log('event selected ', event.id);
    this.isSelected = !this.isSelected;
    this.onSelected.emit(event);  // notify parent list
  };
}
