import {Component, AfterContentInit, OnInit, ViewChild, ViewChildren} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ConfirmComponent } from '../../shared/sc2-confirm';
import {AppType, MenuService} from '../../shared/menu';
import { TranslateService } from '@ngx-translate/core';
import { MsksService } from '../../shared/msks';

import {MenuButtonComponent} from '../../shared/menu/mibutton.component';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/operator/merge';
import { of } from 'rxjs/observable/of';
@Component({
    templateUrl: './kiosk-home.component.html',
    styleUrls: ['./kiosk-home.component.scss']
})

export class KioskHomeComponent implements OnInit {

    public menuitems = new Array<any>();
    private oneId: string;

    private pathView: string;
    private cwdView?: string;
    private pathUpdate: string;
    private cwdUpdate?: string;

    @ViewChildren(MenuButtonComponent)
    private children;

    @ViewChild('modalNoROP')
    private modalNoROP: ConfirmComponent;

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

        const view = document.getElementById('viewPerson');
        const upd = document.getElementById('updateCoslos');

        const s = Observable.merge(fromEvent(view, 'click').mapTo('view'), fromEvent(upd, 'click').mapTo('upd')).throttleTime(8000);

        const sub = s.subscribe(data => {
            // sub.unsubscribe();
            if (data === 'view') {
                this.viewPersonData();
                // console.log(`viewwwwwwww`);
                
            } else if (data === 'upd') {
                this.updateCosLos();
                // console.log('upddddddd');
            }
        });
        
        // const that = this;
        // $('#viewPerson').click(
        //     function(){
        //         that.viewPersonData();
        //     });
        // $('#updateCoslos').click(
        //     function(){
        //         that.updateCosLos();
        //     });
    }

    viewPersonData() {
        this.pathView = 'C:/Program Files/Smartics2 MSKS GEN View Card/Smartics2 MSKS GEN View Card.exe';
        this.cwdView = 'C:/Program Files/Smartics2 MSKS GEN View Card/';
        this.startLocalProgram(this.pathView, this.cwdView);
    }

    updateCosLos() {
        this.pathUpdate = 'C:/Program Files/Smartics2 MSKS GEN UPDCSLS/Smartics2 MSKS GEN UPDCSLS.exe';
        this.cwdUpdate = 'C:/Program Files/Smartics2 MSKS GEN UPDCSLS/';
        this.startLocalProgram(this.pathUpdate, this.cwdUpdate);
    }

    /**
     *
     * @param pathParam
     * @param cmdParam
     */
    startLocalProgram(pathParam: string, cmdParam: string) {
        this.msks.sendRequest('RR_LAUNCHER', 'launch', {
            exemode: 'execfile',
            cmdfile: pathParam,
            cwd: cmdParam
        }, 'PGC').subscribe();
    }
}
