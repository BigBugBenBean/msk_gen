import { Sc2ExecutionFlow } from './sc2-execution-flow';
import { Sc2FlowToken } from './sc2-flow-token';
import { Sc2Node } from './sc2-node';

export class Sc2Executor {
    private readonly flows = new Map<string, Sc2ExecutionFlow>();
    private mainFlowName: string;
    private programToken: Sc2FlowToken;
    private ongoingFlow: Sc2ExecutionFlow;
    private isCancel = false;

    constructor(private readonly name: string, mainFlow: Sc2ExecutionFlow) {
        this.mainFlowName = mainFlow.getName();
        this.addFlow(mainFlow);
    }

    addFlow(flow: Sc2ExecutionFlow) {
        this.flows.set(flow.getName(), flow);
    }

    reset(): Sc2FlowToken {
        this.programToken = this.init(this.mainFlowName);
        this.execute = this.industriousExecutor;
        this.log('activated, ready to proceed...');

        return this.programToken;
    }

    changeFlow(sc2FlowToken: Sc2FlowToken, flowName: string, targetStep: Sc2Node = undefined): Sc2FlowToken {
        this.execute(sc2FlowToken, () => {
            if (this.ongoingFlow.getName() !== flowName) {
                const previouslyOngoingName = this.ongoingFlow.getName();
                this.programToken = this.init(flowName, targetStep);
                this.log('flow changed from ' + previouslyOngoingName + ' to ' + this.ongoingFlow.getName() + '...');
            } else {
                this.log('request to change flow not processed, ongoing flow is already ' + this.ongoingFlow.getName());
            }
        }, 'change flow request');

        return this.programToken;
    }

    changeStep(sc2FlowToken: Sc2FlowToken, targetStep: string) {
        this.execute(sc2FlowToken, () => {
            this.ongoingFlow.revertTo(targetStep);
        }, 'change step request');

        return this;
    }

    test(condition: () => boolean) {
        this.ongoingFlow.test(condition);
    }

    continue(sc2FlowToken: Sc2FlowToken, data: any = undefined) {
        this.execute(sc2FlowToken, () => {
            this.ongoingFlow.continue(data);
        }, 'continue flow execution request');

        return this;
    }

    cancel() {
        this.isCancel = true;
        this.programToken = new Sc2FlowToken();
        this.log('cancelled...');
    }

    isCanceled() {
        return this.isCancel;
    }

    private log(message: string) {
        console.log(this.name + ': ' + message);
    }

    private init(targetFlowName: string, targetStep: Sc2Node = undefined): Sc2FlowToken {
        this.ongoingFlow = this.flows.get(targetFlowName);
        const flowToken = new Sc2FlowToken();
        this.ongoingFlow.begin(targetStep);

        return flowToken;
    }

    private execute(sc2Token: Sc2FlowToken, executyPie: () => void, remarks: string) {
        throw new Error('Hmmm, I really don\'t know. What\'s going on here?');
    }

    private dummyExecutor(sc2Token: Sc2FlowToken, executyPie: () => void, remarks: string) {
        this.log('remarks: ' + remarks + '...');
        this.log('oopsy! Token(' + sc2Token.tokenId + ') is invalid, invocation request not granted...');
    }

    private industriousExecutor(sc2Token: Sc2FlowToken, executyPie: () => void, remarks: string) {
        if (sc2Token === this.programToken) {
            this.log('remarks: ' + remarks + '...');
            this.log('execution granted...');
            executyPie();
        } else {
            this.execute = this.dummyExecutor;
            this.execute(sc2Token, executyPie, remarks);
        }
    }
}
