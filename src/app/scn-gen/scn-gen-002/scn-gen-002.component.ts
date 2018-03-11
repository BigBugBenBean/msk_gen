import { Component, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MenuService } from '../../shared/menu';
import { MenuItem } from '../../shared/menu/mi.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: './scn-gen-002.component.html',
    styleUrls: ['./scn-gen-002.component.scss']
})

export class Page2Component implements AfterContentInit {

    public menuitems = new Array<any>();

    constructor(private router: Router,
        private menusrv: MenuService,
        private translate: TranslateService,
        private route: ActivatedRoute) { }

    nextRoute(next: String) {
        this.router.navigate([next]);
    }

    ngAfterContentInit() {
        this.route.paramMap.switchMap((params) => {
            console.log('params', params);
            this.menuitems.length = 0;
            if (params.get('id')) {
                return this.menusrv.getMenuItems(params.get('id'));
            }else {
                return this.menusrv.getMenuItems();
            }
        }).subscribe((menu) => {
            console.log('after srv', menu);
            let index = 1;
            menu.forEach((mi) => {
                const obj = {
                    ...mi
                };
                obj['index'] = index;
                obj['haschild'] = mi.child !== undefined;
                obj['menukey'] = mi.menukey;
                this.menuitems.push(obj);
                index++;
            });
            console.log('menuitems', this.menuitems, menu);
        });
    }
}
