import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
    templateUrl: './gen-step-001-01.component.html',
    styleUrls: ['./gen-step-001-01.component.scss']
})
export class GenStep00101Component {

    constructor(private router: Router,
                private translate: TranslateService) {}
    /**
     * nextPage.
     */
    nextRoute() {
        this.router.navigate(['/scn-gen/steps/step-002-01']);
        return;
    }

    insertCard() {
        this.router.navigate(['/scn-gen/steps/step-001-02']);
    }

    /**
     * backPage.
     */
    backRoute() {
    }

    timeExpire() {
        setTimeout(() => {
            this.router.navigate(['/scn-gen/gen002']);
        }, 500);
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
