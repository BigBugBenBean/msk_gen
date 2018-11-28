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
import {ConfirmModule} from '../shared/sc2-confirm';
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
import {ProcessingModule} from '../shared/processing-component';
import {KioskHomeComponent} from './kiosk/kiosk-home.component';
import {StepInsertcardComponent} from '../kgen-viewcard/steps/step-001/step-insertcard.component';
import {StepProcessingComponent} from '../kgen-viewcard/steps/step-processing/step-processing.component';
import {StepFingerprintComponent} from '../kgen-viewcard/steps/step-002/step-fingerprint.component';
import {StepViewcardComponent} from '../kgen-viewcard/steps/step-003/step-viewcard.component';
import {StepRetrievecardComponent} from '../kgen-viewcard/steps/step-004/step-retrievecard.component';
import {StepOverComponent} from '../kgen-viewcard/steps/step-over/step-over.component';
import {StepUpdatecardComponent} from '../kgen-viewcard/steps/step-003/step-updatecard.component';
import {IndicateCardTypeModule} from '../shared/indicate-cardtype';
import {SlipprintService} from '../shared/services/print-service/slipprint.service';
import {FingerprintService} from '../shared/services/fingerprint-service/fingerprint.service';
import {ReadcardService} from '../shared/services/readcard-service/readcard.service';
import {ValidatorFingerprintService} from '../shared/services/validator-services/validator.fingerprint.service';
import {CommonService} from '../shared/services/common-service/common.service';
import {LocalStorageService} from '../shared/services/common-service/Local-storage.service';
const routes: Routes = [

    { path: '', redirectTo: 'kioskHome', pathMatch: 'full' },
    { path: 'kioskHome', component: KioskHomeComponent },
    { path: 'insertcard', component: StepInsertcardComponent },
    { path: 'processing', component: StepProcessingComponent },
    { path: 'fingerprint', component: StepFingerprintComponent },
    { path: 'viewcard', component: StepViewcardComponent },
    { path: 'updatecard', component: StepUpdatecardComponent },
    { path: 'retrievecard', component: StepRetrievecardComponent },
    { path: 'over', component: StepOverComponent },
    { path: 'iframe/:url', component: IframeComponent}

];
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
  }
@NgModule({
    declarations: [
        KioskHomeComponent,
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
        StepInsertcardComponent,
        StepProcessingComponent,
        StepFingerprintComponent,
        StepViewcardComponent,
        StepUpdatecardComponent,
        StepRetrievecardComponent,
        StepOverComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MsksModule,
        TimerModule,
        ConfirmModule,
        MenuModule,
        ProcessingModule,
        IndicateCardTypeModule,
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
    providers: [LocalStorageService,
        CommonService,
        ValidatorFingerprintService,
        FingerprintService,
        SlipprintService,
        ReadcardService],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ScreenModule {}
