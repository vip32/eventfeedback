import { Route } from '@angular/router';

import { SessionListComponent } from './index';

export const SessionListRoutes: Route[] = [
  {
    path: 'events/:eventId',
    component: SessionListComponent
  },
];
