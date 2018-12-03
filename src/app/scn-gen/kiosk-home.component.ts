import {Component, AfterContentInit, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ConfirmComponent } from '../../shared/sc2-confirm';
import {AppType, MenuService} from '../../shared/menu';
import { TranslateService } from '@ngx-translate/core';
import { MsksService } from '../shared/msks';

import {LocalStorageService} from '../shared/services/common-service/Local-storage.service';
import {INI_URL} from '../../shared/var-setting';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../shared/services/common-service/common.service';
@Component({
    templateUrl: './kiosk-home.component.html',
    styleUrls: ['./kiosk-home.component.scss']
})

export class KioskHomeComponent implements OnInit {
    operateType = '1';
    isFirst = '0';

    messageFail = '';
    DEVICE_LIGHT_CODE_OCR_READER = '03';
    DEVICE_LIGHT_CODE_IC_READER = '02';
    DEVICE_LIGHT_CODE_PRINTER = '06';
    DEVICE_LIGHT_CODE_FINGERPRINT = '06';
    DEVICE_LIGHT_ALERT_BAR_BLUE_CODE = '11';
    DEVICE_LIGHT_ALERT_BAR_GREEN_CODE = '12';
    DEVICE_LIGHT_ALERT_BAR_RED_CODE = '13';

    constructor(private router: Router,
                private commonService: CommonService,
                private translate: TranslateService,
                private route: ActivatedRoute,
                private httpClient: HttpClient,
                private localStorages: LocalStorageService,
                private msks: MsksService) { }

    ngOnInit() {
        const that = this;
        $('#viewPerson').click(
            function(){
                that.viewPersonData();
            });
        $('#updateCoslos').click(
            function(){
                that.updateCosLos();
            });
    }

    viewPersonData() {
        this.operateType = '1';
        this.storeConfigParam();
        this.router.navigate(['/scn-gen/insertcard']);
        return;
    }

    updateCosLos() {
        this.operateType = '2';
        this.storeConfigParam();
        this.router.navigate(['/scn-gen/insertcard']);
        return;
    }

    storeConfigParam() {
        this.localStorages.set('APP_LANG', this.translate.currentLang);
        this.localStorages.set('operateType', this.operateType);
    }
}
