import { Sc2Step } from './sc2-step';

function defaultNodeName() {
    return 'node-' + Math.random() * 1000000;
}

export class Sc2Node {
    private next: Sc2Node;

    constructor(
        public readonly step: Sc2Step,
        public readonly name: string = defaultNodeName()
    ) {}

    setNextNode(next: Sc2Node) {
        this.next = next;
    }

    getNextNode(): Sc2Node {
        return this.next;
    }
}
