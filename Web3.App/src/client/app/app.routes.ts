import { provideRouter, RouterConfig } from '@angular/router';

import { DebugRoutes } from './+debug/index';
import { AboutRoutes } from './+about/index';
import { HomeRoutes } from './+home/index';
import { LoginRoutes } from './+login/index';
import { EventListRoutes } from './+events/event-list/index';
import { SessionListRoutes } from './+sessions/session-list/index';

const routes: RouterConfig = [
  ...DebugRoutes,
  ...HomeRoutes,
  ...AboutRoutes,
  ...LoginRoutes,
  ...EventListRoutes,
  ...SessionListRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
];
