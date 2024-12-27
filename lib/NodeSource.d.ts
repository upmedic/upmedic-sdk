export declare class NodeSource {
    data: any;
    constructor(data: any);
    getRoot(): any;
    setNumberNodeValue(id: string, value: number): void;
    getNodesByClass(className: string): Array<any>;
    getNodeByConstId(id: string): any;
}
