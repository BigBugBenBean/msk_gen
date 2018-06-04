import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ReadcardService} from '../../shared/services/readcard-service/readcard.service';

@Component ({
    templateUrl: './scn-gen-cardreader.component.html',
    styleUrls: ['./scn-gen-cardreader.component.scss']
})

export class CardReaderComponent {
    constructor(private router: Router,
                private readCard: ReadcardService) { }

    nextRoute(next: String) {
        this.router.navigate([next]);
    }
    previousRoute() {
        this.router.navigate(['/scn-gen/gen007']);
        return;
    }
    scanICCardData() {
        console.log('call scanICCardData');
        this.readCard.scanCardInfo();
    }
    readChipData() {
        console.log('call readChipData');
        this.readCard.validateAuthority();
    }
}
