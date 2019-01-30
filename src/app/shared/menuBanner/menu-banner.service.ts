import { Injectable } from '@angular/core';
import {MenuBannerItem} from './menu-banneritem';
import {ExecuteCmdComponent} from './execute-cmd.component';
import {IntegrateComponent} from './integrate.omponent';

@Injectable()
export class MenuBannerService {
    getItems() {
        return [
            new MenuBannerItem(ExecuteCmdComponent, {headline: 'Hiring for several positions',
            body: 'Submit your resume today!'}),
            new MenuBannerItem(IntegrateComponent, {name: 'inquiry', bio: 'Brave as they come'}),
        ];
    }
}
