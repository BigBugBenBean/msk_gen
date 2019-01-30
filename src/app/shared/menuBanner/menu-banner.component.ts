import { Component, Input, AfterContentInit, ChangeDetectionStrategy, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuBannerItem } from './menu-banneritem';
import { MsksService } from '../msks';
import { MenuBannerDirective } from './menu-banner.directive';
import { BannerComponent } from './banner.component';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
    selector: 'sc2-menu-banner',
    templateUrl: './menu-banner.component.html',
    styleUrls: ['./menu-banner.component.scss'],
//     template: `
//     <div class="ad-banner-example">
//       <h3>Advertisements</h3>
//       <ng-template banner-host></ng-template>
//     </div>
//   `,

    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuBannnerComponent implements OnInit {
    @Input() 
    bannerItems: MenuBannerItem[];
    
    @ViewChild(MenuBannerDirective) 
    bannerHost: MenuBannerDirective;

    // interval: any;
    constructor(private translate: TranslateService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private msks: MsksService) { }

    ngOnInit() {
        this.loadComponent();
        // this.getItems();
    }

    ngOnDestroy() {
        // clearInterval(this.interval);
    }

    loadComponent() {
        // const item = this.bannerItems[this.currentAdIndex];
        this.bannerItems.forEach(item => {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);
            const viewContainerRef = this.bannerHost.viewContainerRef;
            // viewContainerRef.clear();
            const componentRef = viewContainerRef.createComponent(componentFactory);
            (<BannerComponent>componentRef.instance).data = item.data;
        });
    }

    // getItems() {
    //     this.interval = setInterval(() => {
    //         this.loadComponent();
    //     }, 3000);
    // }
}
