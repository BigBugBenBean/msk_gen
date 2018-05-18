import { NgModule } from '@angular/core';
import { MenuService } from '.';
import { MenuButtonComponent } from './mibutton.component';
import { CommonModule } from '@angular/common';
import { MsksModule } from '../msks';
import {ValidatorFingerprintService} from '../services/validator-services/validator.fingerprint.service';

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
        ValidatorFingerprintService
    ],
    exports: [
        MenuButtonComponent
    ]
})
export class MenuModule {}
