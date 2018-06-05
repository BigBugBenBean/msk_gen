import {Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router'
import {QRCodeComponent} from 'angular2-qrcode';
import {SlipprintService} from '../../../shared/services/print-service/slipprint.service';
import {TranslateService} from '@ngx-translate/core';

@Component ({
    templateUrl: './scn-gen-slipprint-cutpaper.component.html',
    styleUrls: ['./scn-gen-slipprint-cutpaper.component.scss']
})

export class SlipprintCutpaperComponent {
    printContent  = '';
    printHeight = '';
    printLeftMargin = '';
    printAttribute = 'black';
    submitted = true;
    constructor(private router: Router,
                private translate: TranslateService,
                private printslip: SlipprintService) { }

    nextRoute(next: String) {
        this.router.navigate([next]);
        return;
    }

    previousRoute() {
        this.router.navigate(['/scn-gen/slipprint']);
        return;
    }

    langButton() {
        const browserLang = this.translate.currentLang;
        console.log(browserLang);
        if (browserLang === 'zh-HK') {
            this.translate.use('en-US');
        } else {
            this.translate.use('zh-HK');
        }
    }
    slipprint(printType) {
        console.log('print type:' + printType);

    }
    /**
     *  start print.
     */
    startPrint() {
        console.log('call startPrint');
        this.submitted = true;
        this.disableStatus();
        this.printAttribute = String($('#printAttribute').val());
        this.handlePrint('cutpaper',
            this.printContent,
            this.printHeight,
            this.printLeftMargin,
            this.printAttribute);
        setTimeout(() => {
            this.restoreStatus()
        }, 1000);
    }

    /**
     *  setting button disable.
     */
    disableStatus() {
        $('#printBtn').removeClass('btnClass');
        $('#printBtn').addClass('btnClassDisabled');
        $('#printBtn').attr('disabled', 'true');
        $('#printBtn').attr('disabled', 'disabled');
    }

    /**
     * restore button status.
     */
    restoreStatus () {
        $('#printBtn').removeClass('btnClassDisabled');
        $('#printBtn').addClass('btnClass');
        $('#printBtn').attr('disabled', 'false');
        $('#printBtn').removeAttr('disabled');
    }

    /**
     * call print fun.
     * @param printType print type:	打印项的类型,可用的值
     *               txt（打印文本）,
     *               vspace(垂直方向走纸，打印空白),
     *               barcode(一维条码),
     *               bmp（图片，用于打印二维码或者logo等）
     * @param printData 打印项的内容，表示打印的文本信息，垂直走纸的像素点数，
     *                   一维条码的文本内容，图片的base64编码格式
     * @param printHeight 仅打印一维码时，设置打印一维码的高度（单位是像素点，1像素点表示0.125毫米）
     * @param leftMargin 该打印项的左边距，单位是像素点，1像素点表示0.125毫米
     * @param attribute 每个打印项的属性，比如是否打印粗体，条码的编码方式，该内容在下面每一项进行详细说明
     */
    private handlePrint(printType,
                        printData,
                        printHeight,
                        leftMargin,
                        attribute) {
        console.log('call handlePrint');
        const dataJson = [
            {
                'type': printType,
                'data': printData,
                'height': printHeight,
                'leftMargin': leftMargin,
                'attribute': attribute
            }
        ];
        this.printslip.printSlip(dataJson);
    }
}
