/**
 * @author James
 * @since
 * @copyright pccw
 */
import {MsksService} from '../../msks';
import {Injectable} from '@angular/core';

@Injectable()
export class FingerprintService {

    constructor(private service: MsksService) {}

    /**
     * get fingerprint data fun.
     */
    getFingerprintData() {
        console.log('start call function : getFingerprintData');
    }

    /**
     *  start scanner fingerprint
     */
    startFingerprintScanner() {
        console.log('call : startFingerprintScanner fun.')
        this.service.sendRequest('RR_FPSCANNERREG', 'takephoto', {'icno': 'A123456'}).subscribe((resp) => {
            if (resp.errorcode === '0') {
                debugger;
                alert(resp.fpdata);
                console.log('fingerprint operate success');

            }
        });
    }

    /**
     *  stop scanner fingerprint
     */
    stopFingerprintScanner() {
        console.log('call : stopFingerprintScanner fun.')
        this.service.sendRequest('RR_FPSCANNERREG', 'stopscan', {'icno': 'A123456'}).subscribe((resp) => {
            if (resp.errorcode === '0') {
                console.log('fingerprint scanner stop success');

            }
        });
    }
}
