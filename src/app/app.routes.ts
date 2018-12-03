import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'scn-gen', pathMatch: 'full'},
  { path: 'scn-gen', loadChildren: './scn-gen#ScreenModule'}
];
