import { NgModule } from '@angular/core';
import { IndicateCardTypeComponent } from './indicate-cardtype.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        IndicateCardTypeComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
        CommonModule,
        IndicateCardTypeComponent,
        TranslateModule
    ]
})
export class IndicateCardTypeModule {}
