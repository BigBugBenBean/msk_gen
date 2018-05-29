import { Component } from '@angular/core';
import { Router } from '@angular/router'
import {FingerprintService} from '../../shared/services/fingerprint-service/fingerprint.service';

@Component ({
    templateUrl: './scn-gen-fingerprint.component.html',
    styleUrls: ['./scn-gen-fingerprint.component.scss']
})

export class FingerprintComponent {
    constructor(private router: Router,
                private fingers: FingerprintService) { }

    nextRoute(next: String) {
        this.router.navigate([next]);
    }
    previousRoute() {
        this.router.navigate(['/scn-gen/gen007']);
    }

    startFingerprintScan() {
        console.log('call startFingerprintScan');
        this.fingers.startFingerprintScanner();
    }
    stopFingerprintScan() {
        console.log('call stopFingerprintScan');
        this.fingers.stopFingerprintScanner();
    }

}
