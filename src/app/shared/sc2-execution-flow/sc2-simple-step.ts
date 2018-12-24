import { Sc2Step } from './sc2-step';

export class Sc2SimpleStep implements Sc2Step {

    constructor(private action: (data) => boolean) {}

    execute(data: any = {}): boolean {
        return this.action(data);
    }
}
