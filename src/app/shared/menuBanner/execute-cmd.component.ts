import { Component, Input } from '@angular/core';
import { BannerComponent } from './banner.component';

@Component({
    template: `
    <div id="viewPerson" class="contentMenuBtn">
        <div class="viewBtnImage"></div>
        <div class="textButtonChinese"> 讀取身份證晶片內的個人資料</div>
        <div class="textButtonEnglish"> View personal data in chip of identity card</div>
    </div>
    `,
    styleUrls: ['./banner.component.scss']
})
export class ExecuteCmdComponent implements BannerComponent {
    @Input()
    data: any;
}

    // <div class="job-ad">
    //   <h4>{{data.headline}}</h4>

    //   {{data.body}}
    // </div>