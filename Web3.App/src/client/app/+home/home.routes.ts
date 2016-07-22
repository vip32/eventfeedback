import { RouterConfig } from '@angular/router';

import { HomeComponent } from './index';

export const HomeRoutes: RouterConfig = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'app/v2',
    component: HomeComponent
  },
];
