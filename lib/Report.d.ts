import { NodeSource } from './NodeSource';
export declare class Report extends NodeSource {
    addToConclusions(sourceNodeId: string, conclusionText: string): void;
    deselectNodeWithId(id: string): void;
    isNodeIdInReport(id: string): boolean;
}
