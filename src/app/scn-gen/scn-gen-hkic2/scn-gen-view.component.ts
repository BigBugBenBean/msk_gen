import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { TIMEOUT_PAYLOAD } from '../../shared/var-setting';
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

    public icno;

    public nameCcc;

    public date_of_first_registration;

    public indicators;

    public chinese_name;

    public state;

    public residential_status;

    public english_name;

    private paramMap: any;

    private oneId: string;

    private icmessage = 'Reading...';

    private TIMEOUT_PAYLOAD = 900;

    constructor(private router: Router,
        private menusrv: MenuService,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private msks: MsksService) { }

    nextRoute(next: String) {
        this.router.navigate([next]);
    }

    ngOnInit() {
        this.msks.sendRequest('RR_NOTICELIGHT', 'flash', { 'device': '05' })
        .switchMap((res) => this.msks.sendRequest('RR_ICCOLLECT', 'opengate', {'timeout': TIMEOUT_PAYLOAD}))
        .subscribe((resp) => {
            this.icno = resp.icno;
            this.english_name = resp.english_name;
            this.chinese_name = resp.chinese_name;
            this.residential_status = resp.residential_status;
            this.date_of_first_registration = resp.date_of_first_registration;
            this.indicators = resp.indicators;
            this.state = resp.state;

            setTimeout(() => {
                this.msks.sendRequest('RR_ICCOLLECT', 'returndoc', {}).subscribe((respo) => {
                    console.log('return doc.....');
                }, e => {
                    console.log('return doc error');
                }, () => {
                    console.log('return doc completed');
                });
            }, 5000);

        }, error => {
            console.log('opengate error!');
        }, () => {
            console.log('opengate completed');
        });
    }

    previousRoute() {
        const next = '/scn-gen/gen002';
        this.router.navigate([next]);
    }

    private returnDoc() {
        this.msks.sendRequest('RR_EICCOLLECT', 'opengate', { 'timeout': TIMEOUT_PAYLOAD } ).subscribe((resp) => {
        });
    }
}
