import { TimerComponent } from './';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        TimerComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
        CommonModule,
        TimerComponent,
        TranslateModule
    ]
})
export class TimerModule { }
