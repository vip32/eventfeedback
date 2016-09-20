import { Route } from '@angular/router';
import { HomeComponent } from './index';

export const HomeRoutes: Route[] = [
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
