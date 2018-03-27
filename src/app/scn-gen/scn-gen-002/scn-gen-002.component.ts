import { Component, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MenuService } from '../../shared/menu';
import { MenuItem } from '../../shared/menu/mi.model';
import { TranslateService } from '@ngx-translate/core';
import { MsksService } from '../../shared/msks';

@Component({
    templateUrl: './scn-gen-002.component.html',
    styleUrls: ['./scn-gen-002.component.scss']
})

export class Page2Component implements AfterContentInit {

    public menuitems = new Array<any>();

    constructor(private router: Router,
        private menusrv: MenuService,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private msks: MsksService) { }

    nextRoute(next: String) {
        this.router.navigate([next]);
    }

    ngAfterContentInit() {
        this.route.paramMap.switchMap((params) => {
            this.menuitems.length = 0;
            if (params.get('id')) {
                return Observable.forkJoin(Observable.of(params.get('srv')), this.menusrv.getMenuItems(params.get('id')));
            } else {
                return Observable.forkJoin(Observable.of(params.get('srv')), this.menusrv.getMenuItems());
            }
        }).switchMap((resp) => {
            if (resp[0]) {
                return this.msks.sendRequest(resp[0], 'getLv2Menu', resp[1])
            } else {
                return Observable.of(resp[1]);
            }
        }).subscribe((resp) => {
            if (Array.isArray(resp) && resp.length) {
                const menu = resp as MenuItem[];
                let index = 1;
                menu.forEach((mi) => {
                    const obj = {
                        ...mi
                    };
                    obj['index'] = index;
                    obj['haschild'] = mi.child !== undefined;
                    obj['menukey'] = mi.menukey;
                    obj['service'] = mi.service;
                    this.menuitems.push(obj);
                    index++;
                });
            } else {
                this.router.navigateByUrl('scn-gen/gen002');
            }
        });
    }
}
