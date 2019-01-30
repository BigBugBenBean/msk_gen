import { Injectable } from '@angular/core';
import {MenuBannerItem} from './menu-banneritem';
import {ExecuteCmdComponent} from './execute-cmd.component';
import {IntegrateComponent} from './integrate.omponent';

@Injectable()
export class MenuBannerService {
    getItems() {
        return [
            new MenuBannerItem(IntegrateComponent, 
                {
                    id: 'viewPerson',
                    image: 'viewBtnImage',
                    chinese: '讀取身份證晶片內的個人資料',
                    english: 'View personal data in chip of identity card'
                }),
            new MenuBannerItem(IntegrateComponent, 
                {
                    id: 'updateCoslos', 
                    image: 'updateBtnImage',
                    chinese: '更新身份證晶片內的逗留條件及逗留期限',
                    english: 'Update Condition of Stay and Limit of Stay in chip of identity card'
                }),
        ];
    }
}
