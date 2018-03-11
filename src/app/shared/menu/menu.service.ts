import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { HttpClient } from '@angular/common/http';

import { MsksApp, AppType } from './msksapp.model';
import { MenuItem } from './mi.model';


@Injectable()
export class MenuService {

    private appmap: Map<string, MsksApp>;
    private lv1timeout: number;
    private lv2timeout: number;
    private initilize = false;
    private menuitems: Array<MenuItem>;
    private initaldata: any;

    constructor(private http: HttpClient) { }

    public getLv1Timeout(): Observable<number> {
        if (this.initilize) {
            return Observable.of(this.lv1timeout);
        } else {
            return this.getData().switchMap(() => {
                return Observable.of(this.lv1timeout);
            });
        }
    }

    public getLv2Timeout(): Observable<number> {
        if (this.initilize) {
            return Observable.of(this.lv1timeout);
        } else {
            return this.getData().switchMap(() => {
                return Observable.of(this.lv1timeout);
            });
        }
    }

    public getMenuItems(lv1key?: string): Observable<MenuItem[]> {

        console.log('initilize', this.initilize);

        if (!this.initilize) {
            return this.getData().switchMap(() => {
                if (lv1key) {
                    let child = [];
                    this.menuitems.forEach((mi) => {
                        if (mi.menukey === lv1key) {
                            console.log(mi.child);
                            child = mi.child;
                        }
                    });
                    return Observable.of(child);

                } else {
                    console.log('getMenu', this.menuitems);
                    return Observable.of(this.menuitems);
                }
            });
        } else {
            if (lv1key) {
                let child = [];
                this.menuitems.forEach((mi) => {
                    if (mi.menukey === lv1key) {
                        console.log(mi.child);
                            child = mi.child;
                    }
                });
                return Observable.of(child);
            } else {
                return Observable.of(this.menuitems);
            }
        }
    }

    private initMsksAppMap(data: any) {
        const msks = data['mskapps'];
        this.appmap = new Map<string, MsksApp>();

        if (msks) {
            for (const i in msks) {
                if (msks[i]) {
                    const app = new MsksApp();
                    app.appkey = msks[i]['app_key'];
                    app.path = msks[i]['path'];
                    if (msks[i]['type'] === 1) {
                        app.type = AppType.WEB;
                    } else if (msks[i]['type'] === 2) {
                        app.type = AppType.APPLICATION;
                        app.cwd = msks[i]['cwd'];
                    } else {
                        console.error(`Unknow type [${msks[i]['type']}] for: ${msks[i]['app_key']}`);
                        app.type = AppType.UNKNOWN;
                    }
                    this.appmap.set(app.appkey, app);
                }
            }
        }

    }

    private initilizeMenuItem(data: any) {
        if (data['lv1_menus']) {
            const menus = data['lv1_menus'] as any[];
            const rs = new Array<MenuItem>();

            menus.forEach((elm) => {
                const mi = new MenuItem();

                mi.chiname = elm['name_chi'];
                mi.engname = elm['name_eng'];
                mi.iconpath = elm['icon_path'];
                mi.menukey = elm['lv1_menu_key'];

                if (elm['lv2_menu_service_channel']) {
                    mi.service = elm['lv2_menu_service_channel'];
                }

                if (elm['lv2_menus']) {
                    const lv2mi = elm['lv2_menus'] as any[];
                    const child = new Array<MenuItem>();
                    lv2mi.forEach((lv2) => {
                        const cmi = new MenuItem();
                        cmi.chiname = lv2['name_chi'];
                        cmi.engname = lv2['name_eng'];
                        cmi.iconpath = lv2['icon_path'];
                        cmi.menukey = lv2['lv2_menu_key'];

                        cmi.app = this.appmap.get(lv2['app_key']);
                        child.push(cmi);
                    });

                    mi.child = child;
                }
                rs.push(mi);
            });

            this.menuitems = rs;
        }
    }

    private getData(): Observable<void> {
        const cached = sessionStorage.getItem('MSKS_GEN_DATA');
        if (cached) {
            const obj = JSON.parse(cached);
            this.appmap = obj['appmap'];
            this.menuitems = obj['menuitems'];
            this.lv1timeout = obj['lv1timeout'];
            this.lv2timeout = obj['lv2timeout'];
            this.initilize = true;
            return Observable.of(undefined);
        } else {
            return Observable.create((observer) => {
                this.http.get(`${API_TERMINAL}/terminal/msksgen`).subscribe((resp) => {
                    this.initMsksAppMap(resp['msksgen']);
                    this.initilizeMenuItem(resp['msksgen']);
                    this.lv1timeout = resp['msksgen']['lvl_timeout'];
                    this.lv2timeout = resp['msksgen']['lv2_timeout'];
                    sessionStorage.setItem('MSKS_GEN_DATA', JSON.stringify({
                        appmap: this.appmap,
                        menuitems: this.menuitems,
                        lv1timeout: this.lv1timeout,
                        lv2timeout: this.lv2timeout
                    }));
                    this.initilize = true;
                    observer.next();
                });
            });
        }
    }

}
