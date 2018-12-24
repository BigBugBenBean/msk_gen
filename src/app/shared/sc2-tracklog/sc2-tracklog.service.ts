import { MsksService } from '../msks';
import { Injectable } from '@angular/core';

@Injectable()
export class TrackLogService {

    constructor(private service: MsksService) {}

    log (message: String) {
        this.service.sendRequest('RR_AUDIT', 'tracklg', {
            'message': message
        }).subscribe((resp) => {
            console.log('tracklog resp: ', resp);
            console.log('success!');
        });

    }

}
