import { Component, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

@Component({
    templateUrl: './iframe.component.html',
    styleUrls: ['./iframe.component.scss', './button.scss']
})
export class IframeComponent implements OnInit {

    public iframurl: SafeResourceUrl;
    public webviewurl: SafeUrl;
    public iswebview:boolean;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe((map) => {
            console.log('map', map);
            this.iframurl = this.sanitizer.bypassSecurityTrustResourceUrl(map.get('url'));
            this.webviewurl = map.get('url');
            this.useWebView().subscribe((e) =>{
                console.log('use webiew', e);
                this.iswebview = e;
            });
        });
    }

    @HostListener('window:load', ['$event'])
    onWindowLoad($event) {
        this.resize();
        $('body').addClass('stop-scrolling');
        $('body').bind('touchmove', function (e) { e.preventDefault() })
        $('body').unbind('touchmove')
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll($event) {
        this.resize();
    }

    public navHome() {
        this.router.navigate(['/scn-gen/gen002']);
    }

    public useWebView(): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) =>{
            if (process.env.TARGET === 'electron-renderer') {
                import('electron').then((electron) => {
                    observer.next(true);
                });
            } else{
                observer.next(false);
            }
        });
    }

    private resize() {
        const w = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
        const h = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
        $('#parent_iframeparent').width(w);
        $('#parent_iframeparent').height(h);
    }
}
