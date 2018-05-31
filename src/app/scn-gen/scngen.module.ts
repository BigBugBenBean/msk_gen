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
import { HKIC2ViewComponent } from './scn-gen-hkic2/scn-gen-view.component';

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
const routes: Routes = [
    { path: '', redirectTo: 'gen001', pathMatch: 'full' },
    { path: 'gen001', component: Page1Component },
    { path: 'gen002', component: Page2Component },
    { path: 'gen002/hkic2/view', component: HKIC2ViewComponent},
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
        IframeComponent,
        HKIC2ViewComponent
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
