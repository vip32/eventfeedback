import { Route } from '@angular/router';

import { SessionListComponent } from './session-list/index';
//import { SessionComponent } from './session/index';

export const SessionRoutes: Route[] = [
  {
    path: 'events/:eventId',
    component: SessionListComponent
  },
];
