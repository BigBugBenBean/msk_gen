import { Injectable } from '@angular/core';
import {MenuBannerItem} from './menu-banneritem';
import {ExecuteCmdComponent} from './execute-cmd.component';
import {IntegrateComponent} from './integrate.omponent';

@Injectable()
export class MenuBannerService {
    getItems() {
        return [
            // new MenuBannerItem(IntegrateComponent,
            //     {
            //         id: 'viewPerson',
            //         image: 'viewBtnImage2',
            //         divclass: 'viewPersonDataInChipBtn',
            //         chinese: '讀取身份證晶片內的個人資料',
            //         chntxt: 'textButtonChineseLeft',
            //         english: 'View personal data in chip of identity card',
            //         engtxt: 'textButtonEnglishLeft',
            //     }),
            // new MenuBannerItem(IntegrateComponent,
            //     {
            //         id: 'updateCoslos',
            //         image: 'updateBtnImage2',
            //         divclass: 'updateCosLosInChipBtn',
            //         chinese: '更新身份證晶片內的逗留條件及逗留期限',
            //         chntxt: 'textButtonChineseRight',
            //         english: 'Update Condition of Stay and Limit of Stay in chip of identity card',
            //         engtxt: 'textButtonEnglishRight',
            //     }),

                new MenuBannerItem(IntegrateComponent,
                    {
                        id: 'viewPerson',
                        image: 'viewBtnImage3',
                        divclass: 'contentMenuBtn',
                        chinese: '讀取身份證晶片內的個人資料',
                        chntxt: 'textButtonChinese3',
                        english: 'View personal data in chip of identity card',
                        engtxt: 'textButtonEnglish3',
                    }),
                new MenuBannerItem(IntegrateComponent,
                    {
                        id: 'updateCoslos',
                        image: 'updateBtnImage3',
                        divclass: 'contentMenuBtn',
                        chinese: '更新身份證晶片內的逗留條件及逗留期限',
                        chntxt: 'textButtonChinese3',
                        english: 'Update Condition of Stay and Limit of Stay in chip of identity card',
                        engtxt: 'textButtonEnglish3',
                    }),
        ];
    }
}
