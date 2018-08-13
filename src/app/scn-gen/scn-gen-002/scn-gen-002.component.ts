import {Component, AfterContentInit, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ConfirmComponent } from '../../shared/sc2-confirm';
import { MenuService } from '../../shared/menu';
import { MenuItem } from '../../shared/menu/mi.model';
import { TranslateService } from '@ngx-translate/core';
import { MsksService } from '../../shared/msks';
import { forkJoin } from 'rxjs/observable/forkJoin';
import {MenuButtonComponent} from '../../shared/menu/mibutton.component';
import {ProcessingComponent} from '../../shared/processing-component';
@Component({
    templateUrl: './scn-gen-002.component.html',
    styleUrls: ['./scn-gen-002.component.scss']
})

export class Page2Component implements OnInit {

    public menuitems = new Array<any>();

    private paramMap: any;

    private oneId: string;

    @ViewChildren(MenuButtonComponent)
    private children;

    @ViewChild('modalNoROP')
    private modalNoROP: ConfirmComponent;

    @ViewChild('processing')
    public processing: ProcessingComponent;

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
        if (this.menuitems.length < 1) {
            this.processing.show();
        }
        this.initPage();
        if (this.menuitems.length < 1) {
            setTimeout(() => {
                this.initPage();
            }, 100);
        }

    }
    initPage() {
        this.menuitems.length = 0;
        const ss = this.menusrv.getMenuItems();
        let param;
        this.route.paramMap.switchMap((params) => {
            param = {
                id: params.get('id'),
                srv: params.get('srv')
            };
            this.oneId = params.get('id');
            return params.has('id') ? this.menusrv.getMenuItems(params.get('id')) : this.menusrv.getMenuItems();
            // return  this.menusrv.getMenuItems();
        }).switchMap((mi: MenuItem[]) => {
            if (param.srv) {
                return forkJoin(Observable.of({ msks: true }), this.msks.sendRequest(param.srv, 'getLv2Menu', mi));
            } else {
                return forkJoin(Observable.of({ msks: false }), Observable.of(mi));
            }
        }).subscribe((resp) => {
            const ismsks = resp[0].msks;
            let menu;
            if (ismsks) {
                menu = this.menusrv.convertChildMenu(resp[1]);
            } else {
                menu = resp[1] as MenuItem[];
            }
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
            this.processing.hide();
        });
    }

    langButton() {
        // this.router.navigate(['main/sck0012'])
        const browserLang = this.translate.currentLang;
        console.log(browserLang);
        if (browserLang === 'zh-HK') {
          this.translate.use('en-US');
        } else {
          this.translate.use('zh-HK');
        }
        // this.ngOnInit();
        setTimeout(() => {
            this.ngOnInit();
        }, 100);
      }

      timeExpire() {
        // this.modalNoROP.show();
        setTimeout(() => {
            // this.router.navigate(['/sck001']);
            this.router.navigate(['/scn-gen/gen001']);
        }, 5000);
    }
}
