import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TimerComponent } from '../shared/sc2-timer/sc2-timer.component';
import { ConfirmComponent } from '../../../shared';
import { TIMEOUT_MILLIS } from '../../../shared/var-setting';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './gen-viewcard-data.component.html',
  styleUrls: ['./gen-viewcard-data.component.scss']
})

export class ViewcardDataComponent implements OnInit {
    @ViewChild('modalFail')
    public modalFail: ConfirmComponent;

    messageFail: String = `The personal particulars in the new card is not acknowledged by applicant,
        please contact the officer for completing your registration.`;

    title: string;
    isEN: boolean;

    idNo = 'D899336(6)';

    nameEng = 'CHAI, Wun Ching';

    nameChi = '齊煥正';

    nameCcc = '7871 3562 2973';

    birthdate = '01-01-1988';

    sex = 'M';

    symbol = '***AZ';

    registration = '01-1999';

    issueDate = '15-09-2018';

    other = 'N/A';

    condStay = 'N/A';

    lenStay = 'N/A';

    showdata = false;

    img = '../../../../assets/images/photo1.jpg'; // set to '' if no image found or set to the Image path;

    buttonNum: Number = 2;
    // message: String = 'Are you sure the information is incorrect?';

    constructor(private router: Router,
        private elRef: ElementRef,
        private route: ActivatedRoute,
        private translate: TranslateService
    ) {}

    ngOnInit() {
      this.title = 'Nature of Access to Information';
      const browserLang = this.translate.currentLang;
      if (browserLang === 'zh-HK') {
          this.isEN = false;
      } else {
          this.isEN = true;
      }
    }

    onGridReady(params) {
        params.api.sizeColumnsToFit();
    }

    goToGeneral() {
        this.router.navigate(['/general']);
    }

    goToPersonal() {
        this.router.navigate(['/personal']);
    }

    newIdCard() {
        // Redirect to page, for advising applicant to click his new ID card at counter.
    }

    confirmIncorrect() {
        this.router.navigate(['/sck001']);
    }

    nextRoute() {
        // this.router.navigate(['/main/sck0091']);
        this.router.navigate(['/main/sck010']);
    }

    timerExpire() {
        this.modalFail.show();
        setTimeout(() => {
            this.router.navigate(['/sck001']);
        }, TIMEOUT_MILLIS);
    }

    backRoute() {
        this.router.navigate(['/sck001']);
    }

    langButton() {
        // this.router.navigate(['main/sck0012'])
        const browserLang = this.translate.currentLang;
        console.log(browserLang);
        if (browserLang === 'zh-HK') {
          this.translate.use('en-US');
          this.isEN = true;
        } else {
          this.translate.use('zh-HK');
          this.isEN = false;
        }
    }
}
