import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';
import { Page1Component } from './scn-gen-001/scn-gen-001.component';
import { Page2Component } from './scn-gen-002/scn-gen-002.component';
import { Page5Component } from './scn-gen-005/scn-gen-005.component';

export const ROUTES: Routes = [
  // { path: '',      component: HomeComponent },
  { path: '', component: Page1Component },
  { path: 'gen002', component: Page2Component },
  { path: 'gen005', component: Page5Component },
  { path: '**',    component: NoContentComponent },
];
