import { RouterConfig } from '@angular/router';

import { SessionListComponent } from './index';

export const SessionListRoutes: RouterConfig = [
  {
    path: 'events/:eventId',
    component: SessionListComponent
  },
];
