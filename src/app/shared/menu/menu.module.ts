import { NgModule } from '@angular/core';
import { MenuService } from '.';
import { MenuButtonComponent } from './mibutton.component';
import { CommonModule } from '@angular/common';
import { MsksModule } from '../msks';
import {ValidatorFingerprintService} from '../services/validator-services/validator.fingerprint.service';
import {SlipprintService} from '../services/print-service/slipprint.service';

@NgModule({
    imports: [
        CommonModule,
        MsksModule
    ],
    declarations: [
        MenuButtonComponent
    ],
    providers: [
        MenuService,
        ValidatorFingerprintService,
        SlipprintService
    ],
    exports: [
        MenuButtonComponent
    ]
})
export class MenuModule {}
