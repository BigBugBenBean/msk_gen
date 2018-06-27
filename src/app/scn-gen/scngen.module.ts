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
import {Page7Component} from './scn-gen-007/scn-gen-007.component';
import {SlipprintComponent} from './scn-gen-slipprint/scn-gen-slipprint.component';
import {FingerprintComponent} from './scn-gen-fingerprint/scn-gen-fingerprint.component';
import {SlipprintTxtComponent} from './scn-gen-slipprint/scn-gen-slipprint-txt/scn-gen-slipprint-txt.component';
import {SlipprintVspaceComponent} from './scn-gen-slipprint/scn-gen-slipprint-vspace/scn-gen-slipprint-vspace.component';
import {SlipprintBmpComponent} from './scn-gen-slipprint/scn-gen-slipprint-bmp/scn-gen-slipprint-bmp.component';
import {SlipprintBarcodeComponent} from './scn-gen-slipprint/scn-gen-slipprint-barcode/scn-gen-slipprint-barcode.componet';
import {SlipprintCutpaperComponent} from './scn-gen-slipprint/scn-gen-slipprint-cutpaper/scn-gen-slipprint-cutpaper.component';
import {CardReaderComponent} from './scn-gen-cardreader/scn-gen-cardreader.component';
import {ConfirmComponent} from '../shared/sc2-confirm';
import {GenStep00101Component} from './scn-gen-steps/steps/gen-steps/gen-step-001/gen-step-001-01.component';
import {GenStepsComponent} from './scn-gen-steps/steps/gen-steps.componoent';
import {GenStep00201Component} from './scn-gen-steps/steps/gen-steps/gen-step-002/gen-step-002-01.component';
import {GenStep00102Component} from './scn-gen-steps/steps/gen-steps/gen-step-001/gen-step-001-02.component';
import {GenStep00202Component} from './scn-gen-steps/steps/gen-steps/gen-step-002/gen-step-002-02.component';
import {GenStep00103Component} from './scn-gen-steps/steps/gen-steps/gen-step-001/gen-step-001-03.component';
import {GenStep00401Component} from './scn-gen-steps/steps/gen-steps/gen-step-004/gen-step-004-01.component';
import {GenStep00301Component} from './scn-gen-steps/steps/gen-steps/gen-step-003/gen-step-003-01.component';
import {GenStepPrivacyComponent} from './scn-gen-steps/steps/gen-steps/gen-step-privacy/gen-step-privacy.component';
import {GenStep00104Component} from './scn-gen-steps/steps/gen-steps/gen-step-001/gen-step-001-04.component';
import {AppointmentBookingComponent} from './appointment-booking/appointment-booking.component';
import {OwpPrefillFormComponent} from './owp-prefill-form/owp-prefill-form.component';
const routes: Routes = [
    { path: '', redirectTo: 'gen001', pathMatch: 'full' },
    { path: 'gen001', component: Page1Component },
    { path: 'gen002', component: Page2Component },
    { path: 'gen002/:id', component: Page2Component },
    { path: 'gen002/:id/:srv', component: Page2Component },
    { path: 'gen005', component: Page5Component },
    { path: 'gen007', component: Page7Component },
    { path: 'slipprint', component: SlipprintComponent },
    { path: 'slipprintTxt', component: SlipprintTxtComponent },
    { path: 'slipprintVspace', component: SlipprintVspaceComponent },
    { path: 'slipprintBarcode', component: SlipprintBarcodeComponent },
    { path: 'slipprintBmp', component: SlipprintBmpComponent },
    { path: 'slipprintCutpaper', component: SlipprintCutpaperComponent },
    { path: 'fingerprint', component: FingerprintComponent },
    { path: 'readNewCard', component: CardReaderComponent },
    { path: 'appoinmentBooking', component: AppointmentBookingComponent },
    { path: 'owpPrefillForm', component: OwpPrefillFormComponent },
    // { path: 'step-001' , component: GenStep001Component },
    { path: 'steps', component: GenStepsComponent,
        children: [
            { path: 'step-privacy' , component: GenStepPrivacyComponent },
            { path: 'step-001-01' , component: GenStep00101Component },
            { path: 'step-001-02' , component: GenStep00102Component },
            { path: 'step-001-03' , component: GenStep00103Component },
            { path: 'step-001-04' , component: GenStep00104Component },
            { path: 'step-002-01' , component: GenStep00201Component },
            { path: 'step-002-02' , component: GenStep00202Component },
            { path: 'step-003-01' , component: GenStep00301Component },
            { path: 'step-004-01' , component: GenStep00401Component }
        ]},
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
        Page7Component,
        SlipprintComponent,
        SlipprintTxtComponent,
        SlipprintVspaceComponent,
        SlipprintBarcodeComponent,
        SlipprintBmpComponent,
        SlipprintCutpaperComponent,
        FingerprintComponent,
        CardReaderComponent,
        GenStepsComponent,
        GenStepPrivacyComponent,
        GenStep00101Component,
        GenStep00102Component,
        GenStep00103Component,
        GenStep00104Component,
        GenStep00201Component,
        GenStep00202Component,
        GenStep00301Component,
        GenStep00401Component,
        AppointmentBookingComponent,
        OwpPrefillFormComponent,
        IframeComponent,
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
