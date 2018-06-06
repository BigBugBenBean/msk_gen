import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
    templateUrl: './gen-step-004-01.component.html',
    styleUrls: ['./gen-step-004-01.component.scss']
})
export class GenStep00401Component {

    constructor(private router: Router,
                private translate: TranslateService) {}
    /**
     * nextPage.
     */
    nextRoute() {
    }

    /**
     * backPage.
     */
    backRoute() {
    }

    langButton() {
        const browserLang = this.translate.currentLang;
        console.log(browserLang);
        if (browserLang === 'zh-HK') {
            this.translate.use('en-US');
        } else {
            this.translate.use('zh-HK');
        }
    }
}
