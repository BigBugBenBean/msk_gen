import { Sc2Step } from './sc2-step';
import { Sc2ConditionalStep } from './sc2-conditional-step';

export class Sc2BranchStep extends Sc2ConditionalStep {
    private alternateAction: (data) => void;

    orElse(alternateAction: (data) => void) {
        this.alternateAction = alternateAction;
        return this;
    }

    execute(data: any = {}): boolean {
        if (!super.execute(data)) {
            this.alternateAction(data);
        }

        return true;
    }
}
