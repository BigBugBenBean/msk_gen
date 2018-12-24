import { Sc2Step } from './sc2-step';
import { Sc2SimpleStep } from './sc2-simple-step';
import { Sc2ConditionalStep } from './sc2-conditional-step';
import { Sc2FlowToken } from './sc2-flow-token';
import { Sc2Node } from './sc2-node';

export class Sc2ExecutionFlow {
    private rootStep: Sc2Node;
    private currentNode: Sc2Node;
    private nodeIndexer = new Map<string, Sc2Node>();

    constructor(private readonly name: string) {
        this.addSc2Step = this.virginAdder;
    }

    addSc2Step(step: Sc2Step, stepName: string = undefined): string {
        throw new Error(this.decorateMessage('Hmmm! Something is really wrong here.'));
    }

    addFunctionStep(step: (data) => boolean, stepName: string = undefined): string {
        return this.addSc2Step(new Sc2SimpleStep(step), stepName);
    }

    continue(data: any = {}): boolean {
        const previousNode = this.currentNode;
        this.currentNode = previousNode.getNextNode();

        return previousNode.step.execute(data);
    }

    test(testForFunction: () => boolean) {
        (<Sc2ConditionalStep>this.currentNode.step).testFor(testForFunction);

        return this;
    }

    begin(targetStepNode: Sc2Node = this.rootStep): Sc2ExecutionFlow {
        console.log('%s started...', this.name);
        this.currentNode = targetStepNode;

        return this;
    }

    revertTo(nodeName: string): Sc2ExecutionFlow {
        this.currentNode = this.nodeIndexer.get(nodeName);

        return this;
    }

    getName(): string {
        return this.name;
    }

    private virginAdder(stepRef: Sc2Step, stepName: string = undefined): string {
        this.rootStep = new Sc2Node(stepRef, stepName);
        this.nodeIndexer.set(this.rootStep.name, this.rootStep);
        this.currentNode = this.rootStep;
        this.addSc2Step = this.veteranAdder;

        return this.currentNode.name;
    }

    private veteranAdder(stepRef: Sc2Step, stepName: string = undefined): string {
        const sc2StepNode = new Sc2Node(stepRef, stepName);
        this.nodeIndexer.set(sc2StepNode.name, sc2StepNode);
        this.currentNode.setNextNode(sc2StepNode);
        this.currentNode = sc2StepNode;

        return this.currentNode.name;
    }

    private decorateMessage(message: string) {
        return this.name + ': ' + message;
    }
}
