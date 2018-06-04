import { Component } from '@angular/core';
import { Router } from '@angular/router'
import {SlipprintService} from '../../shared/services/print-service/slipprint.service';

@Component ({
    templateUrl: './scn-gen-slipprint.component.html',
    styleUrls: ['./scn-gen-slipprint.component.scss']
})

export class SlipprintComponent {
    constructor(private router: Router,
                private printslip: SlipprintService) {
    }

    nextRoute(next: String) {
        this.router.navigate([next]);
        return;
    }

    previousRoute() {
        this.router.navigate(['/scn-gen/gen007']);
        return;
    }

    printTxtDemo() {
        this.router.navigate(['/scn-gen/slipprintTxt']);
        return;
    }

    /**
     * print vspace.
     */
    printVspace() {
        console.log('printVspace');
        this.router.navigate(['/scn-gen/slipprintVspace']);
        return;
    }

    /**
     * print barcode.
     */
    printBarcode() {
        console.log('printBarcode');
        this.router.navigate(['/scn-gen/slipprintBarcode']);
        return;
    }

    /**
     * print bmp.
     */
    printBmp() {
        console.log('printBmp');
        this.router.navigate(['/scn-gen/slipprintBmp']);
        return;
    }

    /**
     * pint cutpaper.
     */
    printCutpaper() {
        console.log('printCutpaper');
        this.router.navigate(['/scn-gen/slipprintCutpaper']);
        return;
    }

    /**
     * demo print
     */
    printDemo() {
        this.handlePrint();
        return;
    }

    /**
     * call print fun.
     */
    private handlePrint() {
        console.log('call handlePrint');
        const dataJson = [
            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '100',
                'attribute': 'normal'
            },

            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '200',
                'attribute': 'normal'
            },

            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'small'
            },

            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'bold'
            },

            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'double_height'
            },

            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'double_width'
            },

            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'underline'
            },

            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'double_width|bold'
            },

            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'double_width|double_height'
            },

            {
                'type': 'txt',
                'data': '1234567890abcdefghijklmnuvwxyz\n',
                'height': '',
                'leftMargin': '0',
                'attribute': 'reverse'
            },

            {
                'type': 'vspace',
                'data': '100',
                'height': '',
                'leftMargin': '',
                'attribute': ''
            },

            {
                'type': 'barcode',
                'data': '1234567890',
                'height': '80',
                'leftMargin': '0',
                'attribute': 'CODE128|DOWN_SIDE'
            },

            {
                'type': 'barcode',
                'data': '1234567890',
                'height': '80',
                'leftMargin': '0',
                'attribute': 'CODE128|NO_TEXT'
            },

            {
                'type': 'barcode',
                'data': 'code93 88888',
                'height': '120',
                'leftMargin': '0',
                'attribute': 'CODE93|UP_SIDE|SMALL_FONT'
            },
            {
                'type': 'bmp',
                'data': 'Base64 bmp Data',
                'height': '',
                'leftMargin': '0',
                'attribute': ''
            },

            {
                'type': 'cutpaper',
                'data': '',
                'height': '',
                'leftMargin': '',
                'attribute': 'full'
            },

            {
                'type': 'cutpaper',
                'data': '',
                'height': '',
                'leftMargin': '',
                'attribute': 'black|full'
            },

            {
                'type': 'cutpaper',
                'data': '',
                'height': '',
                'leftMargin': '',
                'attribute': 'black|half'
            },
        ]

        this.printslip.printSlip(dataJson);
    }
}
