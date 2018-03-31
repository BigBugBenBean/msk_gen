import { NgModule, AfterViewInit, AfterContentInit, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MsksModule } from '../shared/msks';
import { TimerModule } from '../shared/sc2-timer';
import { MenuModule } from '../shared/menu';

import { Page1Component } from './scn-gen-001/scn-gen-001.component';
import { Page2Component } from './scn-gen-002/scn-gen-002.component';
import { Page5Component } from './scn-gen-005/scn-gen-005.component';
import { IframeComponent } from './scn-gen-iframe/iframe.component';

const routes: Routes = [
    { path: '', redirectTo: 'gen001', pathMatch: 'full' },
    { path: 'gen001', component: Page1Component },
    { path: 'gen002', component: Page2Component },
    { path: 'gen002/:id', component: Page2Component },
    { path: 'gen002/:id/:srv', component: Page2Component },
    { path: 'gen005', component: Page5Component },
    { path: 'iframe/:url', component: IframeComponent}
];

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
