import { Sc2ExecutionFlow } from './sc2-execution-flow';
import { Sc2Executor } from './sc2-executor';
import { Sc2FlowToken } from './sc2-flow-token';

export class Sc2ProgramFlow {
    private sc2FlowToken: Sc2FlowToken;
    private programExecutor: Sc2Executor;

    constructor(name: string, mainFlow: Sc2ExecutionFlow) {
        this.programExecutor = new Sc2Executor(name, mainFlow);
    }

    addFlow(newSc2ExecutionFlow: Sc2ExecutionFlow) {
        this.programExecutor.addFlow(newSc2ExecutionFlow);
    }

    start() {
        this.sc2FlowToken = this.programExecutor.reset();
        this.programExecutor.continue(this.sc2FlowToken);
    }

    test(condition: () => boolean) {
        this.programExecutor.test(condition);

        return this;
    }

    proceed(data: any = undefined) {
        this.programExecutor.continue(this.sc2FlowToken, data);
    }

    proceedOnSuccess() {
        return () => {
            this.proceed();
        };
    }

    proceedToFlow(flowName: string, targetStep: string = undefined, data: any = undefined) {
        this.sc2FlowToken = this.programExecutor.changeFlow(this.sc2FlowToken, flowName);

        if (targetStep) {
            this.proceeedToStep(targetStep, data);
        } else {
            this.programExecutor.continue(this.sc2FlowToken, data);
        }
    }

    proceeedToStep(targetStep: string, data: any = undefined) {
        this.programExecutor.changeStep(this.sc2FlowToken, targetStep)
            .continue(this.sc2FlowToken, data);
    }

    abort() {
        this.programExecutor.cancel();
    }

    isAborted() {
        return this.programExecutor.isCanceled();
    }
}
