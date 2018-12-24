export declare let count;
export class Sc2FlowToken {
    public readonly tokenId: string;

    constructor() {
        count = count || 0;
        this.tokenId = 'TOKEN-' + count;
        count = (count + 1) % 1000;
    }
}
