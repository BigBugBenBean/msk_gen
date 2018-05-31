import { Component } from '@angular/core';
import { Router } from '@angular/router'

@Component ({
    templateUrl: './scn-gen-007.component.html',
    styleUrls: ['./scn-gen-007.component.scss']
})

export class Page7Component {
    constructor(private router: Router) { }

    nextRoute(next: String) {
        this.router.navigate([next]);
    }
    previousRoute() {
        this.router.navigate(['/scn-gen/gen002']);
    }

    slipprint() {
        this.router.navigate(['/scn-gen/slipprint']);
    }
    fingerprint() {
        this.router.navigate(['/scn-gen/fingerprint']);
    }
    readCard() {
        this.router.navigate(['/scn-gen/readNewCard']);
    }
}
