import { NgModule, AfterViewInit, AfterContentInit, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MsksModule } from '../shared/msks';
import { TimerModule } from '../shared/sc2-timer';
import { MenuModule } from '../shared/menu';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {ConfirmModule} from '../shared/sc2-confirm';

import {ProcessingModule} from '../shared/processing-component';

import {StepInsertcardComponent} from '../kgen-viewcard/steps/step-001/step-insertcard.component';
import {StepProcessingComponent} from '../kgen-viewcard/steps/step-processing/step-processing.component';
import {StepFingerprintComponent} from '../kgen-viewcard/steps/step-002/step-fingerprint.component';
import {StepViewcardComponent} from '../kgen-viewcard/steps/step-003/step-viewcard.component';
import {StepOverComponent} from '../kgen-viewcard/steps/step-over/step-over.component';
import {StepUpdatecardComponent} from '../kgen-viewcard/steps/step-003/step-updatecard.component';
import {IndicateCardTypeModule} from '../shared/indicate-cardtype';
import {SlipprintService} from '../shared/services/print-service/slipprint.service';
import {FingerprintService} from '../shared/services/fingerprint-service/fingerprint.service';
import {ReadcardService} from '../shared/services/readcard-service/readcard.service';
import {ValidatorFingerprintService} from '../shared/services/validator-services/validator.fingerprint.service';
import {CommonService} from '../shared/services/common-service/common.service';
import {LocalStorageService} from '../shared/services/common-service/Local-storage.service';
import {KioskHomeComponent} from './kiosk-home.component';

const routes: Routes = [

    { path: '', redirectTo: 'kioskHome', pathMatch: 'full' },
    { path: 'kioskHome', component: KioskHomeComponent },
    { path: 'insertcard', component: StepInsertcardComponent },
    { path: 'processing', component: StepProcessingComponent },
    { path: 'fingerprint', component: StepFingerprintComponent },
    { path: 'viewcard', component: StepViewcardComponent },
    { path: 'updatecard', component: StepUpdatecardComponent },
    { path: 'over', component: StepOverComponent }
];
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
  }
@NgModule({
    declarations: [
        KioskHomeComponent,
        StepInsertcardComponent,
        StepProcessingComponent,
        StepFingerprintComponent,
        StepViewcardComponent,
        StepUpdatecardComponent,
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
