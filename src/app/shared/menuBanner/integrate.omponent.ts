import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BannerComponent } from './banner.component';

@Component({
    template: `
    <div id="{{data.id}}" class="{{data.divclass}}">
            <div class="{{data.image}}"></div>
            <div class="{{data.chntxt}}">{{data.chinese}}</div>
            <div class="{{data.engtxt}}">{{data.english}}</div>
        </div>
  `,
  styleUrls: ['./banner.component.scss']
}
)
export class IntegrateComponent implements BannerComponent, OnInit {
    @Input()
    data: any;

    @Output()
    initEvent = new EventEmitter();

    ngOnInit() {
        this.initEvent.emit(this.data.id);
    }
}
// <div class="hero-profile">
//       <h3>Featured Hero Profile</h3>
//       <h4>{{data.name}}</h4>

//       <p>{{data.bio}}</p>

//       <strong>Hire this hero today!</strong>
//     </div>
