import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MenuService } from '../../shared/menu';
import { MenuItem } from '../../shared/menu/mi.model';
import { TranslateService } from '@ngx-translate/core';
import { MsksService } from '../../shared/msks';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { from } from 'rxjs/observable/from';

@Component({
    templateUrl: './scn-gen-view.component.html',
    styleUrls: ['./scn-gen-view.component.scss']
})

export class HKIC2ViewComponent implements OnInit {

    public menuitems = new Array<any>();

    private paramMap: any;

    private oneId: string;

    private icmessage: string = 'Reading...';

    private TIMEOUT_PAYLOAD = 900;

    private icno;

    private nameCcc;

    private date_of_first_registration;

    private indicators;

    private chinese_name;

    private state;

    private residential_status;

    private english_name;

    constructor(private router: Router,
        private menusrv: MenuService,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private msks: MsksService) { }

    previousRoute() {
        const next = this.oneId ? '/scn-gen/gen002' : '/scn-gen/gen001';
        this.router.navigate([next]);
    }

    nextRoute(next: String) {
        this.router.navigate([next]);
    }

    ngOnInit() {

            this.msks.sendRequest('RR_cardreader', 'opencard', { 'timeout': this.TIMEOUT_PAYLOAD } ).subscribe((resp) => {
                debugger
                // if (resp.result || resp.result === 'true') {
                    this.msks.sendRequest('RR_cardreader', 'readhkicv1', { 'timeout': this.TIMEOUT_PAYLOAD } ).subscribe((resp) => {
                        debugger
                        this.icno = resp.icno;
                        this.english_name = resp.english_name;
                        this.chinese_name = resp.chinese_name;
                        this.residential_status = resp.residential_status;
                        this.date_of_first_registration = resp.date_of_first_registration;
                        this.indicators = resp.indicators;
                        this.state = resp.state;
    
                    },(error) => {
                        this.icmessage = this.icmessage+"Card read error...";
                    },() => {
                        this.icmessage = this.icmessage+"Card read completed...";
                    });
            // }
        }, (error) => {
            this.icmessage = this.icmessage+"Open read error...";
        },() => {
            this.icmessage = this.icmessage+"Open read completed...";
        }  );

    }
}
