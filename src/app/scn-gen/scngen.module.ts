import { NgModule, AfterViewInit, AfterContentInit, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MsksModule } from '../shared/msks';
import { TimerModule } from '../shared/sc2-timer';
import { MenuModule } from '../shared/menu';

import { Page1Component } from './scn-gen-001/scn-gen-001.component';
import { Page2Component } from './scn-gen-002/scn-gen-002.component';
import { Page5Component } from './scn-gen-005/scn-gen-005.component';
import { IframeComponent } from './scn-gen-iframe/iframe.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

const routes: Routes = [
    { path: '', redirectTo: 'gen001', pathMatch: 'full' },
    { path: 'gen001', component: Page1Component },
    { path: 'gen002', component: Page2Component },
    { path: 'gen002/:id', component: Page2Component },
    { path: 'gen002/:id/:srv', component: Page2Component },
    { path: 'gen005', component: Page5Component },
    { path: 'iframe/:url', component: IframeComponent}
];
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
  }
@NgModule({
    declarations: [
        Page1Component,
        Page2Component,
        Page5Component,
        IframeComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MsksModule,
        TimerModule,
        MenuModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          }),
        RouterModule.forChild(routes)
    ],
    exports: [
        CommonModule
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ScreenModule {}
