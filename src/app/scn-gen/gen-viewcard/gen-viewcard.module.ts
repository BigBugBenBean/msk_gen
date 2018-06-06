import { NgModule, AfterViewInit, AfterContentInit, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MsksModule } from '../../shared/msks';
import { TimerModule } from '../../shared/sc2-timer';
import { MenuModule } from '../../shared/menu';
import { ConfirmModule } from '../../shared/sc2-confirm';
import { PrivacyComponent } from './scn-gen-003/gen-viewcard-privacy.component';
import { IndicateComponent } from './scn-gen-004/gen-viewcard-indicate.component';
import { InsertcardComponent } from './scn-gen-005/gen-viewcard-insertcard.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export const routes: Routes = [
   { path: '', component: PrivacyComponent},
   { path: 'indicate', component: IndicateComponent},
   { path: 'insertcard', component: InsertcardComponent}
  ];
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
  }
@NgModule({
    declarations: [
        PrivacyComponent,
        IndicateComponent,
        InsertcardComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MsksModule,
        TimerModule,
        ConfirmModule,
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
    ]
})
export class ViewcardModule { }
