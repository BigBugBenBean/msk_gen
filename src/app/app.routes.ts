import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },

  { path: 'msksdemo', loadChildren: './msksdemo#MsksDemoModule'},
  { path: '**',    component: NoContentComponent },
];
