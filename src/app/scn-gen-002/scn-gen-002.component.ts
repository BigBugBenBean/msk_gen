import { Component } from '@angular/core';
import { Router } from '@angular/router'

@Component ({
    templateUrl: './scn-gen-002.component.html',
    styleUrls: ['./scn-gen-002.component.scss']
})

export class Page2Component {
    constructor(private router: Router) { }

    nextRoute(next: String) {
        this.router.navigate([next]);
    }
}
