/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'sc2-app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>

  `
})
export class AppComponent {

  constructor() { }

}
