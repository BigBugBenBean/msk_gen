import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MenuService } from '../../shared/menu';
import { MenuItem } from '../../shared/menu/mi.model';
import { TranslateService } from '@ngx-translate/core';
import { MsksService } from '../../shared/msks';

@Component({
    templateUrl: './scn-gen-002.component.html',
    styleUrls: ['./scn-gen-002.component.scss']
})

export class Page2Component implements OnInit {

    public menuitems = new Array<any>();

    private paramMap: any;

    constructor(private router: Router,
        private menusrv: MenuService,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private msks: MsksService) { }

    nextRoute(next: String) {
        this.router.navigate([next]);
    }

    ngOnInit() {
        this.menuitems.length = 0;

        let param;

        this.route.paramMap.switchMap((params) => {
            param = {
                id: params.get('id'),
                srv: params.get('srv')
            };
            return params.has('id') ? this.menusrv.getMenuItems(params.get('id')) : this.menusrv.getMenuItems();
        }).switchMap((mi: MenuItem[]) => {
            if (param.srv) {
                return this.msks.sendRequest(param.srv, 'getLv2Menu', mi) as Observable<MenuItem[]>;
            } else {
                return Observable.of(mi);
            }
        }).subscribe((resp) => {
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
            // console.log(this.menuitems);
        });
    }

}
