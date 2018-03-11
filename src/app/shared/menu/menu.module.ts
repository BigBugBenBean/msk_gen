import { NgModule } from '@angular/core';
import { MenuService } from '.';
import { MenuButtonComponent } from './mibutton.component';
import { CommonModule } from '@angular/common';
import { MsksModule } from '../msks';

@NgModule({
    imports: [
        CommonModule,
        MsksModule
    ],
    declarations: [
        MenuButtonComponent
    ],
    providers: [
        MenuService
    ],
    exports: [
        MenuButtonComponent
    ]
})
export class MenuModule {}
