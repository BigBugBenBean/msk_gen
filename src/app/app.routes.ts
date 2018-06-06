import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';
// import { Page011Component } from './scn-sck-011/scn-sck-011.component';
import { Page1Component } from './scn-sck-001/scn-sck-001.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'scn-gen', pathMatch: 'full'},
  { path: 'scn-gen', loadChildren: './scn-gen#ScreenModule'},
  { path: 'scn-gen/viewcard', loadChildren: './scn-gen/gen-viewcard#ViewcardModule'},
  { path: '**',    component: NoContentComponent },
];
