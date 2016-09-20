import { Routes } from '@angular/router';

import { DebugRoutes } from './+debug/index';
import { HomeRoutes } from './+home/index';
import { AboutRoutes } from './+about/index';
import { LoginRoutes } from './+login/index';
import { EventListRoutes } from './+events/event-list/index';
import { SessionListRoutes } from './+sessions/session-list/index';

export const routes: Routes = [
  ...DebugRoutes,
  ...HomeRoutes,
  ...AboutRoutes,
  ...LoginRoutes,
  ...EventListRoutes,
  ...SessionListRoutes
];
