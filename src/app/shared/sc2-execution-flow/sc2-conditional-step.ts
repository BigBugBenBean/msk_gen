import { Sc2Step } from './sc2-step';
import { isFunction } from 'util';

export class Sc2ConditionalStep implements Sc2Step {

    protected testPassed: () => boolean;

    constructor(protected action: (data) => boolean) {}

    testFor(testCondition: () => boolean): Sc2ConditionalStep {
        this.testPassed = testCondition;
        return this;
    }

    execute(data: any = {}) {
        if (this.testPassed()) {
            this.action(data);
            return true;
        }

        return false;
    }
}
