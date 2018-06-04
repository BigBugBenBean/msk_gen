import { NgModule } from '@angular/core';
import { PrivacyComponent } from './scn-privacy.component';
import { CommonModule } from '@angular/common';

import { ProcessingComponent, ProcessingModule, ConfirmModule, TimerComponent, TimerModule } from '../../shared';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

export const routes: Routes = [{
    path: '', component: PrivacyComponent
}];

@NgModule({
    declarations: [
        PrivacyComponent
    ],
    imports: [
        CommonModule,
        ProcessingModule,
        TimerModule,
        ConfirmModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        CommonModule,
        RouterModule,
        PrivacyComponent
    ]
})
export class PrivacyModule { }
