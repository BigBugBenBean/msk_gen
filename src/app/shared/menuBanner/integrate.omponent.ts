import { Component, Input } from '@angular/core';
import { BannerComponent } from './banner.component';

@Component({
    template: `
    <div id="updateCoslos" class="contentMenuBtn">
            <div class="updateBtnImage"></div>
            <div class="textButtonChinese">更新身份證晶片內的逗留條件及逗留期限</div>
            <div class="textButtonEnglish">Update Condition of Stay and Limit of Stay in chip of identity card</div>
        </div>
  `,
  styleUrls: ['./banner.component.scss']
}
)
export class IntegrateComponent implements BannerComponent {
    @Input()
    data: any;
}
// <div class="hero-profile">
//       <h3>Featured Hero Profile</h3>
//       <h4>{{data.name}}</h4>

//       <p>{{data.bio}}</p>

//       <strong>Hire this hero today!</strong>
//     </div>